import { IQueryResult } from "coveo-search-ui";
import { ResultLinkTarget } from "../enum";
import { ISalesforceTabOpenerStrategy } from "./ISalesforceTabOpenerStrategy";

export class SalesforceRecordTabOpenerStrategy implements ISalesforceTabOpenerStrategy {
    constructor(private workspaceAPI: Aura.WorkspaceAPI, private result: IQueryResult) {}

    public async openInTab(target: ResultLinkTarget): Promise<string | void> {
        const item = this.getResultSfId();

        try {
            switch(target) {
                case ResultLinkTarget.subTab: return await this.openInSubTab(item);
                case ResultLinkTarget.newWindow:
                case ResultLinkTarget.primaryTab: return await this.openInPrimaryTab(item);
            }
        } catch(err) {
            console.error(err);
        }
    }

    protected async openInPrimaryTab(item: string) {
        if (!item) {
            console.error('SalesforceConsoleResultLink: Could not find a Salesforce ID to navigate to, doing nothing.');
            return Promise.resolve();
        }

        return await this.workspaceAPI.openTab({
            recordId: item,
            focus: true,
        });
    }

    protected async openInSubTab(item: string) {
        if (!item) {
            console.error('SalesforceConsoleResultLink: Could not find a Salesforce ID to navigate to, doing nothing.');
            return Promise.resolve();
        }

        const response = await this.workspaceAPI.getFocusedTabInfo();
        return await this.workspaceAPI.openSubtab({
            parentTabId: response.tabId,
            recordId: item,
            focus: true,
        });
    }

    protected getResultSfId(): string {
        let idToUse = this.result.raw.sfid;
        
        if (this.result.raw.sfkbid && this.result.raw.sfkavid) {
            idToUse = this.result.raw.sfkavid;
        }

        return idToUse || '';
    }
}