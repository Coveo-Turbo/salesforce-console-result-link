import { ComponentOptions, ResultLink, IResultLinkOptions, IQueryResult, IResultsComponentBindings, IBuildingQueryEventArgs, QueryEvents } from 'coveo-search-ui';
import { component, requiresFields } from '@coveops/turbo-core';
import { ResultLinkTarget } from './enum';
import { TabOpenerStrategyResolver } from './resolver';
import { ISalesforceTabOpenerStrategy } from './strategies';
import * as ConfigureQuickviewHeader from '@coveops/configure-quickview-header'

export interface ISalesforceConsoleResultLinkOptions extends IResultLinkOptions {
    hrefTemplate?: string;
    titleTemplate?: string;
    tabLabelTemplate?: string;

    openInPrimaryTab?: boolean;
    openInSubTab?: boolean;
    workspaceAPI?: Aura.WorkspaceAPI;

    applyToQuickviews?: boolean;
}

@component
@requiresFields(...SalesforceConsoleResultLink.fields)
export class SalesforceConsoleResultLink extends ResultLink {
    static ID = 'SalesforceConsoleResultLink';

    static options: ISalesforceConsoleResultLinkOptions = {
        /**
         * Specifies a template literal from which to generate the `ResultLink` `href` attribute value (see
         * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
         *
         * This option overrides the [`field`]{@link ResultLink.options.field} option value.
         *
         * The template literal can reference any number of fields from the parent result. It can also reference global
         * scope properties.
         *
         * **Examples:**
         *
         * - The following markup generates an `href` value such as `http://uri.com?id=itemTitle`:
         *
         * ```html
         * <a class='CoveoResultLink' data-href-template='${clickUri}?id=${raw.title}'></a>
         * ```
         *
         * - The following markup generates an `href` value such as `localhost/fooBar`:
         *
         * ```html
         * <a class='CoveoResultLink' data-href-template='${window.location.hostname}/{Foo.Bar}'></a>
         * ```
         *
         * Default value is `${clickUri}`.
         */
        hrefTemplate: ComponentOptions.buildStringOption({defaultValue: '${clickUri}'}),

        /**
         * Specifies a template literal from which to generate the `ResultLink` display title (see
         * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
         *
         * This option overrides the default `ResultLink` display title behavior.
         *
         * The template literal can reference any number of fields from the parent result. However, if the template literal
         * references a key whose value is undefined in the parent result fields, the `ResultLink` title displays the
         * name of this key instead.
         *
         * This option is ignored if the `ResultLink` innerHTML contains any value.
         *
         * **Examples:**
         *
         * - The following markup generates a `ResultLink` display title such as `Case number: 123456` if both the
         * `raw.objecttype` and `raw.objectnumber` keys are defined in the parent result fields:
         *
         * ```html
         * <a class="CoveoResultLink" data-title-template="${raw.objecttype} number: ${raw.objectnumber}"></a>
         * ```
         *
         * - The following markup generates `${myField}` as a `ResultLink` display title if the `myField` key is undefined
         * in the parent result fields:
         *
         * ```html
         * <a class="CoveoResultLink" data-title-template="${myField}"></a>
         * ```
         *
         * - The following markup generates `Foobar` as a `ResultLink` display title, because the `ResultLink` innterHTML is
         * not empty:
         *
         * ```html
         * <a class="CoveoResultLink" data-title-template="${will} ${be} ${ignored}">Foobar</a>
         * ```
         *
         * Default value is `undefined`.
         */
        titleTemplate: ComponentOptions.buildStringOption(),

        tabLabelTemplate: ComponentOptions.buildStringOption(),

        /**
         * Open links as sub tabs in the Salesforce Console instead of primary tabs.
         *
         * **Examples:**
         *
         * `<a class="CoveoConsoleResultLink" data-open-in-sub-tab="true"></a>
         *
         * Default value is `false`.
         */
        openInSubTab: ComponentOptions.buildBooleanOption({ defaultValue: false }),

        /**
         * Open links as primary tabs in the Salesforce Console.
         *
         * **Examples:**
         *
         * `<a class="CoveoConsoleResultLink" data-open-in-primary-tab="true"></a>
         *
         * Default value is `false`.
         */
        openInPrimaryTab: ComponentOptions.buildBooleanOption({ defaultValue: false }),

        alwaysOpenInNewWindow: ComponentOptions.buildBooleanOption({ defaultValue: true }),

        workspaceAPI: ComponentOptions.buildCustomOption(() => null, { defaultValue: null, required: true }),

        applyToQuickviews: ComponentOptions.buildBooleanOption(),
    };

    static fields = ['sfkbid', 'sfkavid', 'sfid'];

    constructor(public element: HTMLElement, public options: ISalesforceConsoleResultLinkOptions, public bindings: IResultsComponentBindings, public result: IQueryResult) {
        super(element, ComponentOptions.initComponentOptions(element, SalesforceConsoleResultLink, options), bindings, result);

        //Known issue that the Initialization won't always accept the fields
        this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IBuildingQueryEventArgs) => {
            args.queryBuilder.addFieldsToInclude(SalesforceConsoleResultLink.fields);
        });

        if (this.options.applyToQuickviews) {
            this.adjustQuickviews();
        }
    }

    protected bindEventToOpen() {
        if (!this.options.openInPrimaryTab && !this.options.openInSubTab) {
            console.log('ConsoleResultLink: Neither the openInPrimaryTab nor openInSubTab are set, defaulting to ResultLink behavior.');
            return super.bindEventToOpen();
        }

        try {
            const strategy = this.chooseStrategy();
            this.element.onclick = async () => this.handleClick(strategy);
        } catch(e) {
            console.log(e.message);
            return super.bindEventToOpen();
        }

        return true;
    }

    protected chooseStrategy(): ISalesforceTabOpenerStrategy {
        const strategyResolver = new TabOpenerStrategyResolver(this.options.workspaceAPI);
        return strategyResolver.resolve(this.result, {
            hrefTemplate: this.options.hrefTemplate,
            tabLabelTemplate: this.options.tabLabelTemplate
        });
    }

    protected async handleClick(strategy?: ISalesforceTabOpenerStrategy) {
        await this.openItem(strategy);
    }

    protected async openItem(strategy: ISalesforceTabOpenerStrategy) {
        const target = this.determineTarget();

        try {
            await strategy.openInTab(target);
        } catch(err) {
            console.error(err)
        }
    }

    protected determineTarget(): ResultLinkTarget {
        if (this.options.openInSubTab) {
            return ResultLinkTarget.subTab;
        }

        if (this.options.openInPrimaryTab) {
            return ResultLinkTarget.primaryTab;
        }

        return ResultLinkTarget.newWindow;
    }

    protected adjustQuickviews() {
        ConfigureQuickviewHeader({
            resultLinkClass: 'SalesforceConsoleResultLink',
            resultLinkOptions: {
                applyToQuickviews: false,
                ...this.options,
            }
        });
    }
}