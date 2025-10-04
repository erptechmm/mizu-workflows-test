import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, FileText, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function FlutterWebView() {
  const [configs, setConfigs] = useState<string[]>(Array(20).fill(""));
  const [configLabels, setConfigLabels] = useState<string[]>(Array(20).fill(""));
  const [editingLabel, setEditingLabel] = useState<number | null>(null);
  const [tempLabel, setTempLabel] = useState("");
  const [configsCopied, setConfigsCopied] = useState<boolean[]>(Array(20).fill(false));
  const [configsSaving, setConfigsSaving] = useState<boolean[]>(Array(20).fill(false));
  const [configsSaved, setConfigsSaved] = useState<boolean[]>(Array(20).fill(false));
  const { toast } = useToast();

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('flutter_webview_configs')
      .select('*')
      .eq('user_id', user.id)
      .order('config_index');

    if (error) {
      console.error('Error loading configs:', error);
      return;
    }

    if (data) {
      const loadedConfigs = Array(20).fill("");
      const loadedLabels = Array(20).fill("");
      data.forEach(config => {
        if (config.config_index >= 1 && config.config_index <= 20) {
          loadedConfigs[config.config_index - 1] = config.config_text;
          loadedLabels[config.config_index - 1] = config.config_label || "";
        }
      });
      setConfigs(loadedConfigs);
      setConfigLabels(loadedLabels);
    }
  };

  const updateConfigValue = (index: number, value: string) => {
    const newConfigs = [...configs];
    newConfigs[index] = value;
    setConfigs(newConfigs);
  };

  const setConfigCopied = (index: number, copied: boolean) => {
    const newConfigsCopied = [...configsCopied];
    newConfigsCopied[index] = copied;
    setConfigsCopied(newConfigsCopied);
  };

  const startEditingLabel = (index: number) => {
    setEditingLabel(index);
    setTempLabel(configLabels[index] || `Config ${index + 1}`);
  };

  const cancelEditingLabel = () => {
    setEditingLabel(null);
    setTempLabel("");
  };

  const saveLabel = async (index: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save labels",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('flutter_webview_configs')
      .upsert({
        user_id: user.id,
        config_index: index + 1,
        config_text: configs[index] || "",
        config_label: tempLabel.trim() || null,
      }, {
        onConflict: 'user_id,config_index'
      });

    if (error) {
      console.error('Error saving label:', error);
      toast({
        title: "Error saving label",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const newLabels = [...configLabels];
    newLabels[index] = tempLabel.trim();
    setConfigLabels(newLabels);
    setEditingLabel(null);
    setTempLabel("");

    toast({
      title: "Label saved",
      description: "Config label has been updated",
    });
  };

  const saveConfig = async (index: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save configs",
        variant: "destructive",
      });
      return;
    }

    const configText = configs[index];
    if (!configText.trim()) {
      toast({
        title: "Empty config",
        description: "Please enter some text before saving",
        variant: "destructive",
      });
      return;
    }

    const newConfigsSaving = [...configsSaving];
    newConfigsSaving[index] = true;
    setConfigsSaving(newConfigsSaving);

    const { error } = await supabase
      .from('flutter_webview_configs')
      .upsert({
        user_id: user.id,
        config_index: index + 1,
        config_text: configText,
        config_label: configLabels[index] || null,
      }, {
        onConflict: 'user_id,config_index'
      });

    const newConfigsSaving2 = [...configsSaving];
    newConfigsSaving2[index] = false;
    setConfigsSaving(newConfigsSaving2);

    if (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error saving config",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const newConfigsSaved = [...configsSaved];
    newConfigsSaved[index] = true;
    setConfigsSaved(newConfigsSaved);

    toast({
      title: "Saved successfully",
      description: `Config ${index + 1} has been saved`,
    });

    setTimeout(() => {
      const resetSaved = [...newConfigsSaved];
      resetSaved[index] = false;
      setConfigsSaved(resetSaved);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6 shadow-2xl shadow-purple-200/50 border-2 border-purple-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shadow-md">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Flutter Web View App Configuration
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((configNum) => {
              const configIndex = configNum - 1;
              const configValue = configs[configIndex];
              const configCopied = configsCopied[configIndex];
              const configSaving = configsSaving[configIndex];
              const configSaved = configsSaved[configIndex];

              return (
                <div key={configNum}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {editingLabel === configIndex ? (
                      <>
                        <Input
                          value={tempLabel}
                          onChange={(e) => setTempLabel(e.target.value)}
                          className="h-7 text-sm border-2 border-purple-300 focus:border-purple-500 shadow-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveLabel(configIndex);
                            if (e.key === 'Escape') cancelEditingLabel();
                          }}
                        />
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => saveLabel(configIndex)}
                          className="h-7 px-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-md"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={cancelEditingLabel}
                          className="h-7 px-2 border-2 border-gray-300 hover:border-gray-400 shadow-sm"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Label htmlFor={`config-${configNum}`} className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          {configLabels[configIndex] || `Config ${configNum}`}
                        </Label>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => startEditingLabel(configIndex)}
                          className="h-6 px-2 text-xs border border-purple-300 hover:bg-purple-100 hover:text-purple-700 shadow-sm"
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="relative mt-1.5">
                    <Textarea
                      id={`config-${configNum}`}
                      placeholder={`Enter config ${configNum}`}
                      value={configValue}
                      onChange={(e) => updateConfigValue(configIndex, e.target.value)}
                      className="min-h-[100px] pr-2 pb-12 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 resize-y shadow-md shadow-purple-100/50 rounded-lg"
                      rows={3}
                    />
                    <div className="absolute right-2 bottom-2 flex gap-1">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => saveConfig(configIndex)}
                        disabled={configSaving}
                        className="h-8 px-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-300/50 border-0"
                      >
                        {configSaving ? (
                          <>
                            <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Saving
                          </>
                        ) : configSaved ? (
                          <>
                            Saved
                          </>
                        ) : (
                          <>
                            Save
                          </>
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(configValue);
                          setConfigCopied(configIndex, true);
                        }}
                        className="h-8 px-3 border-2 border-purple-300 hover:bg-purple-100 hover:text-purple-700 shadow-md"
                      >
                        {configCopied ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                            Done
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
