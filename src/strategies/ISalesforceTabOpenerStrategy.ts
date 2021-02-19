import { ResultLinkTarget } from "../enum";

export interface ISalesforceTabOpenerStrategy {
    openInTab(target: ResultLinkTarget): Promise<string | void>;
}