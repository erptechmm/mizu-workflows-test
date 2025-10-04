-- Add a column to store custom labels for prompts
ALTER TABLE lovable_prompts 
ADD COLUMN prompt_label TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN lovable_prompts.prompt_label IS 'Custom label for the prompt, defaults to "Prompt X" if not set';