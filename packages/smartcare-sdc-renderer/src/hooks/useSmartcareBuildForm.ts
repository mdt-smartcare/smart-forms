/*
 * Copyright 2025 SmartCare
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useMemo } from 'react';
import { useBuildForm } from '@aehrc/smart-forms-renderer';
import type { BuildFormParams } from '@aehrc/smart-forms-renderer';
import type { Questionnaire, QuestionnaireItem } from 'fhir/r4';
/**
 * Extended parameters for SmartCare's build form hook.
 * Extends the base BuildFormParams from smart-forms-renderer.
 */
export interface SmartcareBuildFormParams extends BuildFormParams {
  /**
   * The language of the form to be rendered.
   * If not provided, the default language will be the language of the questionnaire or the language of the user's browser.
   */
  language?: string;
}

/**
 * SmartCare wrapper hook around useBuildForm from smart-forms-renderer.
 *
 * This hook provides the same functionality as useBuildForm but allows for
 * SmartCare-specific customizations and extensions.
 *
 * @param params - {@link SmartcareBuildFormParams} containing the configuration for building the form
 * @returns boolean indicating whether the form is still building
 *
 * @example
 * ```tsx
 * const isBuilding = useSmartcareBuildForm({
 *   questionnaire: myQuestionnaire,
 *   questionnaireResponse: myResponse,
 *   readOnly: false,
 *   terminologyServerUrl: 'https://tx.fhir.org/r4'
 * });
 *
 * if (isBuilding) {
 *   return <Loading />;
 * }
 *
 * return <SmartFormsRenderer />;
 * ```
 */
function useSmartcareBuildForm(params: SmartcareBuildFormParams): boolean {
  // Extract base params for useBuildForm
  const {
    language,
    questionnaire,
    questionnaireResponse,
    readOnly,
    terminologyServerUrl,
    additionalContext,
    rendererConfigOptions,
    qItemOverrideComponents,
    sdcUiOverrideComponents
  } = params;

  const languageToUse = language || questionnaire.language || 'en';
  
  // Memoize the translated questionnaire to prevent unnecessary rebuilds
  // Only recalculate when questionnaire or language actually changes
  const questionnaireWithTranslations = useMemo(() => {
    return convertQuestionnaireToLanguage(questionnaire, languageToUse);
  }, [questionnaire, languageToUse]);

  // Call the underlying useBuildForm hook
  const isBuilding = useBuildForm({
    questionnaire: questionnaireWithTranslations,
    questionnaireResponse,
    readOnly,
    terminologyServerUrl,
    additionalContext,
    rendererConfigOptions,
    qItemOverrideComponents,
    sdcUiOverrideComponents
  });

  // Add SmartCare-specific logic here as needed
  // For now, we simply return the isBuilding state from useBuildForm

  return isBuilding;
}

/**
 * Recursively applies translations to a questionnaire item and all its nested children.
 */
function applyTranslationsToItem(item: QuestionnaireItem, language: string): void {
  item.text = getTranslationText(item, language) || item.text;
  if (item.item && item.item.length > 0) {
    item.item.forEach((childItem: QuestionnaireItem) => {
      applyTranslationsToItem(childItem, language);
    });
  }
}

function convertQuestionnaireToLanguage(questionnaire: Questionnaire, language: string) {
  //Loop through the questionnaire and convert the items to the language
  //create a new questionnaire with the translations
  const questionnaireToUse = { ...questionnaire };
  questionnaireToUse.item?.forEach((item: QuestionnaireItem) => {
    applyTranslationsToItem(item, language);
  });
  return questionnaireToUse;
}
//get the translation text for the item
function getTranslationText(item: QuestionnaireItem, language: string) {
  const translationExts = item?.extension?.filter(
    (e: any) => e.url === 'http://example.com/fhir/translation'
  );
  //loop through the translation extensions and find the one with the language code
  if (translationExts && translationExts.length > 0) {
    for (const translationExt of translationExts) {
      const langExt = translationExt.extension?.find(
        (e: any) => e.url === 'lang' && e.valueCode === language
      );
      //if the language code is found, get the content
      if (langExt) {
        const contentExt = translationExt.extension?.find(
          (e: any) => e.url === 'content'
        );
        if (contentExt && contentExt.valueString) {
          return contentExt.valueString;
        }
      }
    }
  }
  //if no translation is found, return null
  return null;
}

export default useSmartcareBuildForm;