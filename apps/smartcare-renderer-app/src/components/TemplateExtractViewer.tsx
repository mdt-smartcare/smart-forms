import { useState, useCallback } from 'react';
import type { FhirResource } from 'fhir/r4';
import {
  useQuestionnaireStore,
  useQuestionnaireResponseStore,
  removeEmptyAnswersFromResponse,
  SdcTemplateExtract
} from 'smartcare-sdc-renderer';

const { inAppExtract, extractResultIsOperationOutcome } = SdcTemplateExtract;

function TemplateExtractViewer() {
  const [extractedResource, setExtractedResource] = useState<FhirResource | FhirResource[] | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sourceQuestionnaire = useQuestionnaireStore.use.sourceQuestionnaire();
  const updatableResponse = useQuestionnaireResponseStore.use.updatableResponse();

  const handleTemplateExtract = useCallback(async () => {
    if (!sourceQuestionnaire || !updatableResponse) {
      setError('No questionnaire or response available. Please fill out the form first.');
      return;
    }

    setIsExtracting(true);
    setError(null);

    try {
      const responseToExtract = removeEmptyAnswersFromResponse(
        sourceQuestionnaire,
        structuredClone(updatableResponse)
      );

      const inAppExtractOutput = await inAppExtract(responseToExtract, sourceQuestionnaire, null);
      const extractResult = inAppExtractOutput.extractResult;

      if (extractResultIsOperationOutcome(extractResult)) {
        setExtractedResource(extractResult);
        if (extractResult.issue?.some(i => i.severity === 'error' || i.severity === 'fatal')) {
          setError('Extraction completed with errors. See the result below.');
        }
      } else {
        setExtractedResource(extractResult.extractedBundle);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to extract');
      setExtractedResource(null);
    } finally {
      setIsExtracting(false);
    }
  }, [sourceQuestionnaire, updatableResponse]);

  return (
    <div className="h-full flex flex-col">
      {/* Header with Extract Button */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200 rounded-t-lg">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Template-Based Extraction</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Extract FHIR resources from the questionnaire response using templates
          </p>
        </div>
        <button
          onClick={handleTemplateExtract}
          disabled={isExtracting || !sourceQuestionnaire}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isExtracting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Extracting...
            </>
          ) : (
            'Extract Resources'
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Extracted Result */}
      <div className="flex-1 overflow-auto bg-slate-50 rounded-b-lg">
        {extractedResource ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">Extracted Resources</span>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(extractedResource, null, 2))}
                className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Copy JSON
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap break-words bg-white p-4 rounded border border-slate-200">
              {JSON.stringify(extractedResource, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <p className="mb-2">No extracted resources yet</p>
              <p className="text-sm text-slate-400">
                Fill out the form and click "Extract Resources" to see the result
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateExtractViewer;

