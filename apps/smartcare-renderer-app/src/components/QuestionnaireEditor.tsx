import { useState, useCallback, useEffect } from 'react';

interface QuestionnaireEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

function QuestionnaireEditor({ initialValue, onChange }: QuestionnaireEditorProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onChange(newValue);
    },
    [onChange]
  );

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      setValue(formatted);
      onChange(formatted);
    } catch {
      // Invalid JSON, don't format
    }
  }, [value, onChange]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end px-3 py-2 border-b border-slate-100 bg-slate-50">
        <button
          onClick={handleFormat}
          className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
          Format JSON
        </button>
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        spellCheck={false}
        className="json-editor flex-1 w-full p-4 resize-none border-0 bg-slate-50 text-slate-800 focus:bg-white transition-colors"
        placeholder="Paste your FHIR Questionnaire JSON here..."
      />
    </div>
  );
}

export default QuestionnaireEditor;

