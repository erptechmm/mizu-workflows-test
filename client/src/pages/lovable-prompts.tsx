import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, FileText, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function LovablePrompts() {
  const [prompts, setPrompts] = useState<string[]>(Array(20).fill(""));
  const [promptLabels, setPromptLabels] = useState<string[]>(Array(20).fill(""));
  const [editingLabel, setEditingLabel] = useState<number | null>(null);
  const [tempLabel, setTempLabel] = useState("");
  const [promptsCopied, setPromptsCopied] = useState<boolean[]>(Array(20).fill(false));
  const [promptsSaving, setPromptsSaving] = useState<boolean[]>(Array(20).fill(false));
  const [promptsSaved, setPromptsSaved] = useState<boolean[]>(Array(20).fill(false));
  const { toast } = useToast();

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('lovable_prompts')
      .select('*')
      .eq('user_id', user.id)
      .order('prompt_index');

    if (error) {
      console.error('Error loading prompts:', error);
      return;
    }

    if (data) {
      const loadedPrompts = Array(20).fill("");
      const loadedLabels = Array(20).fill("");
      data.forEach(prompt => {
        if (prompt.prompt_index >= 1 && prompt.prompt_index <= 20) {
          loadedPrompts[prompt.prompt_index - 1] = prompt.prompt_text;
          loadedLabels[prompt.prompt_index - 1] = prompt.prompt_label || "";
        }
      });
      setPrompts(loadedPrompts);
      setPromptLabels(loadedLabels);
    }
  };

  const updatePromptValue = (index: number, value: string) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const setPromptCopied = (index: number, copied: boolean) => {
    const newPromptsCopied = [...promptsCopied];
    newPromptsCopied[index] = copied;
    setPromptsCopied(newPromptsCopied);
  };

  const startEditingLabel = (index: number) => {
    setEditingLabel(index);
    setTempLabel(promptLabels[index] || `Prompt ${index + 1}`);
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
      .from('lovable_prompts')
      .upsert({
        user_id: user.id,
        prompt_index: index + 1,
        prompt_text: prompts[index] || "",
        prompt_label: tempLabel.trim() || null,
      }, {
        onConflict: 'user_id,prompt_index'
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

    const newLabels = [...promptLabels];
    newLabels[index] = tempLabel.trim();
    setPromptLabels(newLabels);
    setEditingLabel(null);
    setTempLabel("");

    toast({
      title: "Label saved",
      description: "Prompt label has been updated",
    });
  };

  const savePrompt = async (index: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save prompts",
        variant: "destructive",
      });
      return;
    }

    const promptText = prompts[index];
    if (!promptText.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter some text before saving",
        variant: "destructive",
      });
      return;
    }

    const newPromptsSaving = [...promptsSaving];
    newPromptsSaving[index] = true;
    setPromptsSaving(newPromptsSaving);

    const { error } = await supabase
      .from('lovable_prompts')
      .upsert({
        user_id: user.id,
        prompt_index: index + 1,
        prompt_text: promptText,
        prompt_label: promptLabels[index] || null,
      }, {
        onConflict: 'user_id,prompt_index'
      });

    const newPromptsSaving2 = [...promptsSaving];
    newPromptsSaving2[index] = false;
    setPromptsSaving(newPromptsSaving2);

    if (error) {
      console.error('Error saving prompt:', error);
      toast({
        title: "Error saving prompt",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const newPromptsSaved = [...promptsSaved];
    newPromptsSaved[index] = true;
    setPromptsSaved(newPromptsSaved);

    toast({
      title: "Saved successfully",
      description: `Prompt ${index + 1} has been saved`,
    });

    setTimeout(() => {
      const resetSaved = [...newPromptsSaved];
      resetSaved[index] = false;
      setPromptsSaved(resetSaved);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-xl font-semibold text-gray-800">
                Lovable Prompts Configuration
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((promptNum) => {
              const promptIndex = promptNum - 1;
              const promptValue = prompts[promptIndex];
              const promptCopied = promptsCopied[promptIndex];
              const promptSaving = promptsSaving[promptIndex];
              const promptSaved = promptsSaved[promptIndex];

              return (
                <div key={promptNum}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {editingLabel === promptIndex ? (
                      <>
                        <Input
                          value={tempLabel}
                          onChange={(e) => setTempLabel(e.target.value)}
                          className="h-7 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveLabel(promptIndex);
                            if (e.key === 'Escape') cancelEditingLabel();
                          }}
                        />
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => saveLabel(promptIndex)}
                          className="h-7 px-2"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={cancelEditingLabel}
                          className="h-7 px-2"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Label htmlFor={`prompt-${promptNum}`} className="text-sm font-medium text-gray-700">
                          {promptLabels[promptIndex] || `Prompt ${promptNum}`}
                        </Label>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => startEditingLabel(promptIndex)}
                          className="h-6 px-2 text-xs"
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="relative mt-1.5">
                    <Textarea
                      id={`prompt-${promptNum}`}
                      placeholder={`Enter prompt ${promptNum}`}
                      value={promptValue}
                      onChange={(e) => updatePromptValue(promptIndex, e.target.value)}
                      className="min-h-[100px] pr-2 pb-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-y"
                      rows={3}
                    />
                    <div className="absolute right-2 bottom-2 flex gap-1">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => savePrompt(promptIndex)}
                        disabled={promptSaving}
                        className="h-8 px-3"
                      >
                        {promptSaving ? (
                          <>
                            <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                            Saving
                          </>
                        ) : promptSaved ? (
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
                          navigator.clipboard.writeText(promptValue);
                          setPromptCopied(promptIndex, true);
                        }}
                        className="h-8 px-3"
                      >
                        {promptCopied ? (
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
