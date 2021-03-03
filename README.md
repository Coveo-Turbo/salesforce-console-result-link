# SalesforceConsoleResultLink

The SalesforceConsoleResultLink bridges various use cases for the ResultLink within Salesforce and adds support for viewing external content in tabs within the Salesforce console and have the tab name reflect the name of the article.

This component does not support Lazy loading, however, CoveoJSSearch.Lazy resource was removed from Coveo for Salesforce as of version 4.11 released in December 2020. See [Coveo for Salesforce v4 Release Notes](https://docs.coveo.com/en/3236/coveo-for-salesforce/coveo-for-salesforce-v4-release-notes#december-2020-release-v411)

Errors that arise due to the environment will be visible in the console and the code will fallback to the `ResultLink`.

Disclaimer: This component was built by the community at large and is not an official Coveo JSUI Component. Use this component at your own risk.

## Getting Started

1. Install the component into your project.

```
npm i @coveops/salesforce-console-result-link
```

2. Use the Component or extend it

Typescript:

```javascript
import { SalesforceConsoleResultLink, ISalesforceConsoleResultLinkOptions } from '@coveops/salesforce-console-result-link';
```

Javascript

```javascript
const SalesforceConsoleResultLink = require('@coveops/salesforce-console-result-link').SalesforceConsoleResultLink;
```

3. You can also expose the component alongside other components being built in your project.

```javascript
export * from '@coveops/salesforce-console-result-link'
```

4. Or for quick testing, you can add the script from unpkg

```html
<script src="https://unpkg.com/@coveops/salesforce-console-result-link@latest/dist/index.min.js"></script>
```

> Disclaimer: Unpkg should be used for testing but not for production.

5. Include the component in your template as follows:

Place the component in your markup:

```html
<div class="CoveoSalesforceConsoleResultLink"></div>
```

To open items in the primary console tab (default behavior and is equivalent to the above statement):

```html
<div class="CoveoSalesforceConsoleResultLink" data-open-in-primary-tab="true"></div>
```

To open items in the sub console tab:

```html
<div class="CoveoSalesforceConsoleResultLink" data-open-in-sub-tab="true"></div>
```

To open items in a new browser tab:

```html
<div class="CoveoSalesforceConsoleResultLink" data-open-in-primary-tab="false"></div>
```

To replace the ResultLink in Quickview headers as well:

```html
<a class="CoveoSalesforceConsoleResultLink" data-open-in-sub-tab="true" data-apply-to-quickviews="true"></a>
```

## Options 

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| hrefTemplate | string | `${clickUri}` | Specifies a template literal from which to generate the `ResultLink` `href` attribute value (see [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)) |
| titleTemplate | string |  | Specifies a template literal from which to generate the `ResultLink` display title (see [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)). |
| tabLabelTemplate | string | `${raw.title}` |  |
| openInPrimaryTab | boolean | true | Specifies whether the result link should open within the primary tabs of the Salesforce console. |
| openInSubTab | boolean | false | Specifies whether the result link should open within the sub tabs of the Salesforce console within an open Salesforce record. |
| alwaysOpenInNewWindow | boolean | true | Specifies whether the result link should open in a new browser tab. This option only applies if the environment isn't compatible with the workforceAPI or the `openInPrimaryTab` option is set to `false`. |
| workspaceAPI | workspaceAPI |  | The Salesforce workspaceAPI must be passed to the component at initialization. If it is not, the component will fallback to the `ResultLink` |
| applyToQuickviews | boolean | false | Specifies whether the ResultLink in Quickview headers should be replaced with the `SalesforceConsoleResultLink` |

## Installation in Salesforce

In order to use this component in Salesforce, some extra steps are required. 

1. You must wrap the Coveo Lightning Component in an Aura component. See [Wrapping the Lightning Coveo component to include Static Resources](https://coveo-turbo.github.io/docs/Salesforce-Integration.html#wrapping-the-lightning-coveo-component-to-include-static-resources)

This will permit you to copy the dist code from the [component itself](https://unpkg.com/@coveops/salesforce-console-result-link@latest/dist/index.min.js) or a custom code bundle into a Static Resource and use it. See [Creating a Static Resource](https://coveo-turbo.github.io/docs/Salesforce-Integration.html#creating-a-static-resource)

2. Within the Aura component, you will need to add a declaration for the workspace API, as well as an initialization:

```xml
<lightning:workspaceAPI aura:id="workspaceAPI" />
<aura:handler name="init" value="{!this}" action="{!c.init}" />
```

3. Add an Aura Controller to the component. If your wrapper was named `SampleAgentPanel.cmp` then the controller file is named `SampleAgentPanelController.js` and is part of the Aura component bundle.

Take note of the id you gave to the wrapped Coveo component in the first step, since you will need to reference is below. 

```xml
<CoveoV2:AgentPanel
        aura:id="AgentInsightPanel"
```

Replace `AgentInsightPanel` in the code sample below with the corresponding ID.

```js
({
    init: function (component, event, helper) {
        const coveoComponent = component.find('AgentInsightPanel');
        const coveoSearchUI = coveoComponent.get('v.searchUI');
        const workspaceAPI = component.find('workspaceAPI');

        coveoSearchUI.registerBeforeInit(function (cmp, rootInterface, Coveo) {
            coveoSearchUI.setSearchInterfaceOptions({
                SalesforceConsoleResultLink: {
                    workspaceAPI
                }
            });
        });
    }
})
```

You can use the templates found in the [`salesforce`](https://github.com/Coveo-Turbo/salesforce-console-result-link/tree/master/salesforce) folder as a reference.

## Extending

Extending the component can be done as follows:

```javascript
import { SalesforceConsoleResultLink, ISalesforceConsoleResultLinkOptions } from "@coveops/salesforce-console-result-link";

export interface IExtendedSalesforceConsoleResultLinkOptions extends ISalesforceConsoleResultLinkOptions {}

export class ExtendedSalesforceConsoleResultLink extends SalesforceConsoleResultLink {}
```

## Contribute

1. Clone the project
2. Copy `.env.dist` to `.env` and update the COVEO_ORG_ID and COVEO_TOKEN fields in the `.env` file to use your Coveo credentials and SERVER_PORT to configure the port of the sandbox - it will use 8080 by default.
3. Build the code base: `npm run build`
4. Serve the sandbox for live development `npm run serve`