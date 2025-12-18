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

// Re-export everything from smart-forms-renderer
export * from '@aehrc/smart-forms-renderer';

// Re-export sdc-assemble as a namespace to avoid conflicts
import * as SdcAssemble from '@aehrc/sdc-assemble';
export { SdcAssemble };

// Re-export sdc-populate as a namespace to avoid conflicts
import * as SdcPopulate from '@aehrc/sdc-populate';
export { SdcPopulate };

// Re-export sdc-template-extract as a namespace to avoid conflicts
import * as SdcTemplateExtract from '@aehrc/sdc-template-extract';
export { SdcTemplateExtract };

// Export SmartCare-specific hooks
export * from './hooks';
