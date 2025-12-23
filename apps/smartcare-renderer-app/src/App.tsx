import { useState, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { Questionnaire, QuestionnaireResponse } from 'fhir/r4';
import QuestionnaireEditor from '@/components/QuestionnaireEditor';
import FormRenderer from '@/components/FormRenderer';
import ResponseViewer from '@/components/ResponseViewer';
import TemplateExtractViewer from '@/components/TemplateExtractViewer';
import { sampleQuestionnaire } from '@/data/sampleQuestionnaire';
import { getResponse } from 'smartcare-sdc-renderer';

type ActiveTab = 'form' | 'response' | 'extract';

function App() {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(sampleQuestionnaire);
  const [questionnaireResponse, setQuestionnaireResponse] = useState<QuestionnaireResponse | null>(
    null
  );
  const [language, setLanguage] = useState<string>('en');
  const [activeTab, setActiveTab] = useState<ActiveTab>('form');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [renderKey, setRenderKey] = useState(0);

  const handleQuestionnaireChange = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString) as Questionnaire;
      if (parsed.resourceType !== 'Questionnaire') {
        setJsonError('Invalid resource: must be a FHIR Questionnaire');
        return;
      }
      setQuestionnaire(parsed);
      setJsonError(null);
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  }, []);

  const handleRenderClick = useCallback(() => {
    if (questionnaire && !jsonError) {
      setQuestionnaireResponse(null);
      setRenderKey((prev) => prev + 1);
    }
  }, [questionnaire, jsonError]);

  const handleResponseChange = useCallback((_response: QuestionnaireResponse) => {
    setQuestionnaireResponse(getResponse());
  }, []);

  return (
    <div className="h-screen w-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">SmartCare Renderer App</h1>
              <p className="text-sm text-slate-500">Test your FHIR Questionnaires</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="language" className="text-sm font-medium text-slate-600">
                Language:
              </label>
              <input
                id="language"
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="en"
                className="w-20 px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleRenderClick}
              disabled={!questionnaire || !!jsonError}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors">
              Render Form
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-81px)]">
        <PanelGroup direction="horizontal">
          {/* Left Panel - Questionnaire Editor */}
          <Panel defaultSize={40} minSize={25}>
            <div className="h-full flex flex-col bg-white border-r border-slate-200">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h2 className="text-sm font-semibold text-slate-700">FHIR Questionnaire JSON</h2>
                {jsonError && (
                  <p className="text-xs text-red-500 mt-1 truncate" title={jsonError}>
                    Error: {jsonError}
                  </p>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <QuestionnaireEditor
                  initialValue={JSON.stringify(sampleQuestionnaire, null, 2)}
                  onChange={handleQuestionnaireChange}
                />
              </div>
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-1.5 bg-slate-200 hover:bg-blue-400 transition-colors cursor-col-resize" />

          {/* Right Panel - Form/Response */}
          <Panel defaultSize={60} minSize={30}>
            <div className="h-full flex flex-col bg-white">
              {/* Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50">
                <button
                  onClick={() => {setActiveTab('form');}}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'form'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}>
                  Form Preview
                </button>
                <button
                  onClick={() => {setActiveTab('response');handleResponseChange(getResponse())}}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'response'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}>
                  Questionnaire Response
                </button>
                {/* <button
                  onClick={() => setActiveTab('extract')}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'extract'
                      ? 'text-green-600 border-b-2 border-green-600 bg-white'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}>
                  Template Extract
                </button> */}
              </div>

              {/* Tab Content - Both tabs rendered, using visibility to preserve state */}
              <div className="flex-1 overflow-auto relative">
                {/* Form Preview Tab - Always mounted to preserve state */}
                <div 
                  className="p-4 h-full absolute inset-0 overflow-auto"
                  style={{ 
                    visibility: activeTab === 'form' ? 'visible' : 'hidden',
                    pointerEvents: activeTab === 'form' ? 'auto' : 'none'
                  }}
                >
                  {questionnaire ? (
                    <FormRenderer
                      key={renderKey}
                      questionnaire={questionnaire}
                      language={language}
                      onResponseChange={handleResponseChange}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      <p>Enter a valid FHIR Questionnaire JSON and click "Render Form"</p>
                    </div>
                  )}
                </div>

                {/* Response Tab */}
                <div 
                  className="p-4 h-full absolute inset-0 overflow-auto"
                  style={{ 
                    visibility: activeTab === 'response' ? 'visible' : 'hidden',
                    pointerEvents: activeTab === 'response' ? 'auto' : 'none'
                  }}
                >
                  <ResponseViewer questionnaireResponse={questionnaireResponse} />
                </div>

                {/* Template Extract Tab */}
                <div 
                  className="p-4 h-full absolute inset-0 overflow-auto"
                  style={{ 
                    visibility: activeTab === 'extract' ? 'visible' : 'hidden',
                    pointerEvents: activeTab === 'extract' ? 'auto' : 'none'
                  }}
                >
                  <TemplateExtractViewer />
                </div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
}

export default App;

