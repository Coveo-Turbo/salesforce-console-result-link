import { IQueryResult } from "coveo-search-ui";
import { ISalesforceTabOpenerStrategy, SalesforceRecordTabOpenerStrategy, ExternalLinkTabOpenerStrategy } from "../strategies";

export interface ITabOpenerOptions {
    hrefTemplate?: string;
    tabLabelTemplate?: string;
}

export class TabOpenerStrategyResolver {
    static SALESFORCE_OBJECT_IDENTIFIER_FIELD = 'sysfiletype';
    static SALESFORCE_OBJECT_IDENTIFIER_VALUE = 'SalesforceItem';

    constructor(protected workspaceAPI) {}

    resolve(result: IQueryResult, options: ITabOpenerOptions): ISalesforceTabOpenerStrategy {
        if (this.isSalesforceItem(result)) {
            return new SalesforceRecordTabOpenerStrategy(this.workspaceAPI, result)
        }

        return new ExternalLinkTabOpenerStrategy(this.workspaceAPI, result, options.hrefTemplate, options.tabLabelTemplate)
    }

    protected isSalesforceItem(result: IQueryResult) {
        return TabOpenerStrategyResolver.SALESFORCE_OBJECT_IDENTIFIER_VALUE === result.raw[TabOpenerStrategyResolver.SALESFORCE_OBJECT_IDENTIFIER_FIELD];
    }
}