import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { GitBranch, Copy, AlertTriangle, Info } from "lucide-react";

export default function GitReplace() {
  const [targetRepo, setTargetRepo] = useState("");
  const [sourceRepo, setSourceRepo] = useState("");
  const [generatedCommands, setGeneratedCommands] = useState("");
  const [isOutputVisible, setIsOutputVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateInputs = (target: string, source: string): boolean => {
    if (!target.trim() || !source.trim()) {
      setError("Both Target for Lovable and Source fields are required.");
      return false;
    }
    
    const targetSlashes = (target.match(/\//g) || []).length;
    const sourceSlashes = (source.match(/\//g) || []).length;
    
    if (targetSlashes < 4) {
      setError("Target for Lovable URL must contain at least 4 forward slashes (/).");
      return false;
    }
    
    if (sourceSlashes < 4) {
      setError("Source URL must contain at least 4 forward slashes (/).");
      return false;
    }
    
    return true;
  };

  const generateCommands = (targetRepo: string, sourceRepo: string): string => {
    const getTextAfterFourthSlash = (url: string): string => {
      const parts = url.split('/');
      if (parts.length > 4) {
        return parts.slice(4).join('/');
      }
      return '';
    };
    
    const revisedTargetRepo = getTextAfterFourthSlash(targetRepo);
    const revisedSourceRepo = getTextAfterFourthSlash(sourceRepo);
    
    return `git clone ${targetRepo}.git
cd ${revisedTargetRepo}
git rm -r *
git rm -r .[^.] .??*
git commit -m "Delete all files and folders"
git push origin main
git clone ${targetRepo}.git && git clone ${sourceRepo}.git && rsync -av --exclude='.git' ${revisedSourceRepo}/ ${revisedTargetRepo}/ && cd ${revisedTargetRepo} && git add . && git commit -m "Migrate repository content" && git push`;
  };

  const handleConvert = () => {
    setError("");
    
    if (!validateInputs(targetRepo, sourceRepo)) {
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const commands = generateCommands(targetRepo, sourceRepo);
      setGeneratedCommands(commands);
      setIsOutputVisible(true);
      setIsLoading(false);
    }, 500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCommands);
      toast({
        title: "Success",
        description: "Commands copied to clipboard!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy commands to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = () => {
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="targetInput" className="text-lg font-semibold text-gray-700 flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                Target for Lovable
              </Label>
              <Input
                id="targetInput"
                type="text"
                placeholder="https://github.com/username/target-repository.git"
                value={targetRepo}
                onChange={(e) => {
                  setTargetRepo(e.target.value);
                  handleInputChange();
                }}
                className="w-full h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-colors"
              />
              <p className="text-sm text-gray-500 ml-1">Enter the target repository URL</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="sourceInput" className="text-lg font-semibold text-gray-700 flex items-center">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                Source
              </Label>
              <Input
                id="sourceInput"
                type="text"
                placeholder="https://github.com/username/source-repository.git"
                value={sourceRepo}
                onChange={(e) => {
                  setSourceRepo(e.target.value);
                  handleInputChange();
                }}
                className="w-full h-12 text-base border-2 border-gray-200 focus:border-purple-500 rounded-lg transition-colors"
              />
              <p className="text-sm text-gray-500 ml-1">Enter the source repository URL</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleConvert}
              disabled={isLoading}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Converting...
                </>
              ) : (
                <>
                  <GitBranch className="mr-3 h-5 w-5" />
                  Convert
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {isOutputVisible && (
          <Card className="mb-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  Generated Git Commands
                </CardTitle>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="border-2 hover:bg-green-50 hover:border-green-500 transition-colors"
                >
                  <Copy className="mr-1.5 h-4 w-4" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 overflow-x-auto border border-gray-700 shadow-inner">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                  {generatedCommands}
                </pre>
              </div>
              
              <Alert className="mt-6 border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-amber-800 text-base">
                  <span className="font-semibold">Important:</span> These commands will delete all files in the target repository and replace them with files from the source repository. Make sure you have backups before executing.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center text-lg font-bold">
              <Info className="mr-3 h-6 w-6 text-blue-600" />
              How it works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-800 space-y-3 text-base">
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                <p>The tool extracts the text that comes after the fourth forward slash (/) in each repository URL</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                <p>It generates a series of Git commands to migrate content from source to target repository</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                <p>The generated commands will clear the target repository and copy all files from the source</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                <p>Make sure both repository URLs are valid and accessible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
