import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { GitBranch, Copy, AlertTriangle, Info } from "lucide-react";

export default function Home() {
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
    
    if (target.length < 29) {
      setError("Target for Lovable URL must be at least 29 characters long.");
      return false;
    }
    
    if (source.length < 29) {
      setError("Source URL must be at least 29 characters long.");
      return false;
    }
    
    return true;
  };

  const generateCommands = (targetRepo: string, sourceRepo: string): string => {
    // Remove first 29 characters as specified
    const revisedTargetRepo = targetRepo.substring(29);
    const revisedSourceRepo = sourceRepo.substring(29);
    
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
    
    // Simulate processing delay for better UX
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <GitBranch className="text-blue-500 mr-3 h-6 w-6" />
            Git Command Generator
          </h1>
          <p className="text-gray-600 mt-1">Generate Git commands for repository migration and setup</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Repository Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Target for Lovable Input */}
            <div className="space-y-2">
              <Label htmlFor="targetInput">Target for Lovable</Label>
              <Input
                id="targetInput"
                type="text"
                placeholder="https://github.com/username/target-repository.git"
                value={targetRepo}
                onChange={(e) => {
                  setTargetRepo(e.target.value);
                  handleInputChange();
                }}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Enter the target repository URL</p>
            </div>

            {/* Source Input */}
            <div className="space-y-2">
              <Label htmlFor="sourceInput">Source</Label>
              <Input
                id="sourceInput"
                type="text"
                placeholder="https://github.com/username/source-repository.git"
                value={sourceRepo}
                onChange={(e) => {
                  setSourceRepo(e.target.value);
                  handleInputChange();
                }}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Enter the source repository URL</p>
            </div>

            {/* Error Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Convert Button */}
            <Button 
              onClick={handleConvert}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Converting...
                </>
              ) : (
                <>
                  <GitBranch className="mr-2 h-4 w-4" />
                  Convert
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        {isOutputVisible && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Git Commands</CardTitle>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="mr-1.5 h-4 w-4" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {generatedCommands}
                </pre>
              </div>
              
              <Alert className="mt-4 border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-800">
                  <span className="font-medium">Important:</span> These commands will delete all files in the target repository and replace them with files from the source repository. Make sure you have backups before executing.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center">
              <Info className="mr-2 h-5 w-5" />
              How it works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-800 space-y-2 text-sm">
              <p>• The tool removes the first 29 characters from each repository URL to extract the repository name</p>
              <p>• It generates a series of Git commands to migrate content from source to target repository</p>
              <p>• The generated commands will clear the target repository and copy all files from the source</p>
              <p>• Make sure both repository URLs are valid and accessible</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
