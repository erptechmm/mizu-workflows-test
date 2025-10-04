import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FileText, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Types for the highlighted text editor
interface HighlightedTextEditorProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
}

// Custom highlighted text editor component
function HighlightedTextEditor({ value, onChange, placeholder, className, onFocus }: HighlightedTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Template words to highlight in purple - different from sales workflows
  const templateWords = ['Developer Name', 'Project Name', 'replit.com', 'vercel.com', 'GitHub Repository', 'API Key', 'Environment Variable', 'Domain Name', 'Database URL', 'Contact Email'];
  
  // Function to highlight template words
  const highlightText = (text: string) => {
    if (!text) return '';
    
    let highlightedText = text;
    templateWords.forEach(word => {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span style="color: #8b5cf6; background-color: #f3f4f6; padding: 1px 3px; border-radius: 3px; font-weight: 500;">$&</span>`);
    });
    
    return highlightedText.replace(/\n/g, '<br>');
  };

  // Save cursor position
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    }
    return 0;
  };

  // Restore cursor position
  const restoreCursorPosition = (position: number) => {
    if (!editorRef.current) return;
    
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let currentPosition = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const textLength = node.textContent?.length || 0;
      if (currentPosition + textLength >= position) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(node, position - currentPosition);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
        break;
      }
      currentPosition += textLength;
    }
  };
  
  // Handle input changes
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (isUpdating) return;
    
    const text = (e.target as HTMLDivElement).innerText || '';
    const cursorPosition = saveCursorPosition();
    
    setIsUpdating(true);
    onChange(text);
    
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = highlightText(text);
        restoreCursorPosition(cursorPosition);
      }
      setIsUpdating(false);
    }, 0);
  };
  
  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
    
    // Clear placeholder when focusing
    if (editorRef.current && (!value || !value.trim())) {
      const content = editorRef.current.innerHTML;
      if (content.includes('color: #9ca3af')) {
        editorRef.current.innerHTML = '';
      }
    }
    
    if (onFocus) {
      onFocus();
    }
  };
  
  // Handle blur events
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  // Update editor content when value changes externally (only when not focused to avoid cursor issues)
  useEffect(() => {
    if (editorRef.current && !isFocused && !isUpdating) {
      const currentText = editorRef.current.innerText || '';
      if (currentText !== value) {
        if (value && value.trim()) {
          editorRef.current.innerHTML = highlightText(value);
        } else {
          editorRef.current.innerHTML = `<span style="color: #9ca3af;">${placeholder || 'Click to start typing...'}</span>`;
        }
      }
    }
  }, [value, isFocused, isUpdating, placeholder]);

  // Initialize placeholder on mount
  useEffect(() => {
    if (editorRef.current && (!value || !value.trim())) {
      editorRef.current.innerHTML = `<span style="color: #9ca3af;">${placeholder || 'Click to start typing...'}</span>`;
    }
  }, []);
  
  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
      style={{
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        outline: 'none',
        minHeight: '400px'
      }}
      dangerouslySetInnerHTML={{
        __html: value && value.trim() ? highlightText(value) : `<span style="color: #9ca3af;">${placeholder || 'Click to start typing...'}</span>`
      }}
      suppressContentEditableWarning={true}
    />
  );
}

export default function ReplitToVercel() {
  const [step1, setStep1] = useState("");
  const [step2, setStep2] = useState("");
  const [step3, setStep3] = useState("");
  const [steps, setSteps] = useState<string[]>(Array(9).fill(""));
  const [error, setError] = useState("");
  const [step1Copied, setStep1Copied] = useState(false);
  const [step2Copied, setStep2Copied] = useState(false);
  const [step3Copied, setStep3Copied] = useState(false);
  const [stepsCopied, setStepsCopied] = useState<boolean[]>(Array(9).fill(false));

  const handleInputChange = () => {
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Form */}
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm" data-testid="card-input-form">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-xl font-semibold text-gray-800">
                Replit Made to Vercel Ready Configuration
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 2 */}
            <div>
              <Label htmlFor="step-2" className="text-sm font-medium text-gray-700">
                Create <span className="text-purple-600 font-semibold">vercel.json</span> file in the root directory with this content
              </Label>
              <div className="relative mt-1.5">
                <HighlightedTextEditor
                  value={step2}
                  onChange={(text) => {
                    setStep2(text);
                    handleInputChange();
                  }}
                  onFocus={() => {
                    if (!step2) {
                      const techText = `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public",
        "buildCommand": "npm run build:client"
      }
    },
    {
      "src": "server/index.ts",
      "use": "@vercel/node",
      "config": {
        "buildCommand": "npm run build:server"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ]
}`;
                      setStep2(techText);
                    }
                  }}
                  placeholder={`{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public",
        "buildCommand": "npm run build:client"
      }
    },
    {
      "src": "server/index.ts",
      "use": "@vercel/node",
      "config": {
        "buildCommand": "npm run build:server"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ]
}`}
                  className="min-h-[400px] w-full p-3 pr-20 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-y"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(step2);
                    setStep2Copied(true);
                  }}
                  className="absolute right-2 top-4 h-8 px-3 border-gray-300 hover:bg-gray-50"
                  data-testid="button-copy-step-2"
                >
                  {step2Copied ? (
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
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  Template words to customize: <span className="text-red-500 font-medium">Developer Name, Project Name, GitHub Repository, Environment Variable, Database URL, Domain Name, Contact Email</span>
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <Label htmlFor="step-3" className="text-sm font-medium text-gray-700">
                Change your <span className="text-purple-600 font-semibold">scripts section</span> in the root <span className="text-purple-600 font-semibold">package.json</span> to this:
              </Label>
              <div className="relative mt-1.5">
                <HighlightedTextEditor
                  value={step3}
                  onChange={(text) => {
                    setStep3(text);
                    handleInputChange();
                  }}
                  onFocus={() => {
                    if (!step3) {
                      const quickGuideText = `"scripts": { 
"dev": "NODE_ENV=development tsx server/index.ts", 
"build:client": "vite build", 
"build:server": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist", 
"build": "npm run build:client && npm run build:server", 
"start": "NODE_ENV=production node dist/index.js", 
"check": "tsc", 
"db:push": "drizzle-kit push" },`;
                      setStep3(quickGuideText);
                    }
                  }}
                  placeholder={`"scripts": { 
"dev": "NODE_ENV=development tsx server/index.ts", 
"build:client": "vite build", 
"build:server": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist", 
"build": "npm run build:client && npm run build:server", 
"start": "NODE_ENV=production node dist/index.js", 
"check": "tsc", 
"db:push": "drizzle-kit push" },`}
                  className="min-h-[400px] w-full p-3 pr-20 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-y"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(step3);
                    setStep3Copied(true);
                  }}
                  className="absolute right-2 top-4 h-8 px-3 border-gray-300 hover:bg-gray-50"
                  data-testid="button-copy-step-3"
                >
                  {step3Copied ? (
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
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  Template words to customize: <span className="text-red-500 font-medium">Developer Name, Project Name, GitHub Repository, Environment Variable, Database URL, Domain Name, Contact Email</span>
                </p>
              </div>
            </div>

            {/* Additional steps - following the same pattern as sales-workflows but with different placeholders */}
            {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((stepNum) => {
              const stepIndex = stepNum - 4; // Convert to 0-based index
              const stepValue = steps[stepIndex];
              const stepCopied = stepsCopied[stepIndex];
              
              const updateStepValue = (value: string) => {
                const newSteps = [...steps];
                newSteps[stepIndex] = value;
                setSteps(newSteps);
              };
              
              const setStepCopied = (copied: boolean) => {
                const newStepsCopied = [...stepsCopied];
                newStepsCopied[stepIndex] = copied;
                setStepsCopied(newStepsCopied);
              };
              
              return (
                <div key={stepNum}>
                  <Label htmlFor={`step-${stepNum}`} className="text-sm font-medium text-gray-700">
                    {stepNum === 4 ? 'Go to Vercel' : `Step ${stepNum}`}
                  </Label>
                  <div className="relative mt-1.5">
{stepNum === 4 ? (
                      <Textarea
                        id={`step-${stepNum}`}
                        placeholder={`1. Go back to your Vercel Dashboard.
2. Click the "Add New..." button and select "Project."
3. Select your GitHub account and find the repository.
4. On the import screen, pay close attention to the settings:
   • Root Directory: Leave this field blank, as your vercel.json is in the root of the repository.
   • Build & Output Settings: Vercel should automatically detect a build command. Confirm that the "Build Command" is npm run build and the "Output Directory" is dist/public. If they are not detected correctly, you can manually set them.
5. Click "Deploy."`}
                        value={stepValue}
                        onChange={(e) => {
                          updateStepValue(e.target.value);
                          handleInputChange();
                        }}
                        onFocus={() => {
                          if (!stepValue) {
                            const vercelSteps = `1. Go back to your Vercel Dashboard.
2. Click the "Add New..." button and select "Project."
3. Select your GitHub account and find the repository.
4. On the import screen, pay close attention to the settings:
   • Root Directory: Leave this field blank, as your vercel.json is in the root of the repository.
   • Build & Output Settings: Vercel should automatically detect a build command. Confirm that the "Build Command" is npm run build and the "Output Directory" is dist/public. If they are not detected correctly, you can manually set them.
5. Click "Deploy."`;
                            updateStepValue(vercelSteps);
                          }
                        }}
                        className="min-h-[180px] pr-20 border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-none"
                        data-testid={`input-step-${stepNum}`}
                      />
                    ) : (
                      <Input
                        id={`step-${stepNum}`}
                        type="text"
                        placeholder={`Enter step ${stepNum}`}
                        value={stepValue}
                        onChange={(e) => {
                          updateStepValue(e.target.value);
                          handleInputChange();
                        }}
                        className="pr-20 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        data-testid={`input-step-${stepNum}`}
                      />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(stepValue);
                        setStepCopied(true);
                      }}
                      className={`absolute right-2 h-8 px-3 border-gray-300 hover:bg-gray-50 ${stepNum === 4 ? 'top-4' : 'top-1/2 -translate-y-1/2'}`}
                      data-testid={`button-copy-step-${stepNum}`}
                    >
                      {stepCopied ? (
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
              );
            })}

            {/* Error Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}