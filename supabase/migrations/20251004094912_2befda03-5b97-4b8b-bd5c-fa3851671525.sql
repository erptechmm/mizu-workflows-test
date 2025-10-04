-- Add unique constraint on user_id and prompt_index for upsert functionality
ALTER TABLE public.lovable_prompts 
ADD CONSTRAINT lovable_prompts_user_prompt_unique UNIQUE (user_id, prompt_index);