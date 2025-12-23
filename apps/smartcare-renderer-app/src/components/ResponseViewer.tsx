import type { QuestionnaireResponse } from 'fhir/r4';

interface ResponseViewerProps {
  questionnaireResponse: QuestionnaireResponse | null;
}

function ResponseViewer({ questionnaireResponse }: ResponseViewerProps) {
  if (!questionnaireResponse) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <div className="text-center">
          <p className="mb-2">No response yet</p>
          <p className="text-sm text-slate-400">
            Fill out the form to see the QuestionnaireResponse
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200 rounded-t-lg">
        <h3 className="text-sm font-semibold text-slate-700">QuestionnaireResponse</h3>
        <button
          onClick={() => navigator.clipboard.writeText(JSON.stringify(questionnaireResponse, null, 2))}
          className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
          Copy JSON
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-slate-50 rounded-b-lg">
        <pre className="json-editor p-4 text-slate-800 whitespace-pre-wrap break-words">
          {JSON.stringify(questionnaireResponse, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default ResponseViewer;

