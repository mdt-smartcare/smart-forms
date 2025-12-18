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
  //I want to convert the questionnaire to the languageToUse
  const questionnaireWithTranslations = convertQuestionnaireToLanguage(questionnaire, languageToUse);
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

function convertQuestionnaireToLanguage(questionnaire: Questionnaire, language: string) {
  //Loop through the questionnaire and convert the items to the language
  //create a new questionnaire with the translations
  const questionnaireToUse = { ...questionnaire };
  questionnaireToUse.item?.forEach((item: QuestionnaireItem) => {
    //we need to loop through the extension and find the one with the language code
    //and return the content
    
    //1. get the translation text for the item
    //2. if the translation text is not found, use the original text
    //3. add the translation text to the item
    //4. loop through the items and convert the text to the language
    //5. return the questionnaire with the translations
    //6. the translation text is stored in the extension with the url http://example.com/fhir/translation
    //7. the language code is stored in the extension with the url http://example.com/fhir/translation/lang
    //8. the content is stored in the extension with the url http://example.com/fhir/translation/content
    item.text = getTranslationText(item, language) || item.text;
    item.item?.forEach((childItem: QuestionnaireItem) => {
      childItem.text = getTranslationText(childItem, language) || childItem.text;
      if (childItem.item && childItem.item.length > 0) {
        childItem.item.forEach((grandchildItem: QuestionnaireItem) => {
          grandchildItem.text = getTranslationText(grandchildItem, language) || grandchildItem.text;
        });
      }
    });
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