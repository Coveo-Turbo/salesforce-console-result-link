import { IQueryResult, StringUtils } from "coveo-search-ui";
import { ResultLinkTarget } from "../enum";
import { ISalesforceTabOpenerStrategy } from "./ISalesforceTabOpenerStrategy";

export class ExternalLinkTabOpenerStrategy implements ISalesforceTabOpenerStrategy {
    constructor(private workspaceAPI: Aura.WorkspaceAPI, private result: IQueryResult, private hrefTemplate: string, private tabLabelTemplate?: string) {}

    public async openInTab(target: ResultLinkTarget): Promise<string | void> {
        const item = StringUtils.buildStringTemplateFromResult(this.hrefTemplate, this.result);
        
        try {
            switch(target) {
                case ResultLinkTarget.subTab: return await this.openInSubTab(item);
                case ResultLinkTarget.primaryTab: return await this.openInPrimaryTab(item);
                case ResultLinkTarget.newWindow: return this.openInNewWindow(item);
            }
        } catch(err) {
            console.error(err);
        }
    }

    protected async openInPrimaryTab(item: string) {
        const tabId = await this.workspaceAPI.openTab({
            url: item,
            focus: true,
        });

        await this.workspaceAPI.setTabLabel({
            tabId: tabId,
            label: this.generateTabLabel(),
        });
    }

    protected async openInSubTab(item: string) {
        let focusedTab = await this.workspaceAPI.getFocusedTabInfo();
        await this.workspaceAPI.openSubtab({
            parentTabId: focusedTab.tabId,
            url: item,
            focus: true,
        });

        focusedTab = await this.workspaceAPI.getFocusedTabInfo();
        await this.workspaceAPI.setTabLabel({
            tabId: focusedTab.tabId,
            label: this.generateTabLabel(),
        });
    }

    protected openInNewWindow(item: string) {
        let auraClickEvent = $A.get('e.force:navigateToURL');
        auraClickEvent.setParams({
            url: item,
        });

        auraClickEvent.fire();
    }

    protected generateTabLabel() {
        return this.tabLabelTemplate || this.result.title;
    }
}