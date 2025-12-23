import type { Questionnaire, QuestionnaireResponse } from 'fhir/r4';
import {
  BaseRenderer,
  RendererThemeProvider,
  useSmartcareBuildForm,
} from 'smartcare-sdc-renderer';

interface FormRendererProps {
  questionnaire: Questionnaire;
  language: string;
  onResponseChange: (response: QuestionnaireResponse) => void;
}

function FormRenderer({ questionnaire, language }: FormRendererProps) {
  const isBuilding = useSmartcareBuildForm({
    questionnaire,
    language
  });
console.log('isrendererbuilding');
  if (isBuilding) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 text-sm">Building form...</p>
        </div>
      </div>
    );
  }

  return (
    <RendererThemeProvider>
      <div className="max-w-4xl mx-auto">
        <BaseRenderer />
      </div>
    </RendererThemeProvider>
  );
}

export default FormRenderer;
