type Dictionary = { [key: string]: any };

declare namespace Aura {
    export interface $A {
        createComponent<C extends Aura.Component>(
            descriptor: string,
            attributes: any,
            fn: (component: C, status: State, error: any) => void
        ): void;
        getCallback(func: Function): () => void;
        enqueueAction(action: Action): void;
        get(key: string): any;
    }

    export interface Component {
        getLocalId(): string;
        getGlobalId(): string;
        getName(): string;
        find(key: string): any;
        getElement(): HTMLElement;
        get(key: string): any;
        set(key: string, value: any): void;
        getEvent(key: string): Aura.Event;
        destroy(): void;
    }

    export type State = 'NEW' | 'RUNNING' | 'SUCCESS' | 'ERROR' | 'INCOMPLETE' | 'ABORTED';

    export interface Action {
        getCallback(status: string): any;
        getName(): string;
        getParams(): Dictionary;
        setParams(params: Dictionary): void;
        setCallback(context: any, func: (response: Action) => void, name?: string): void;
        getReturnValue(): any;
        getError(): any;
        getState(): State;
    }

    export interface Event {
        fire(): void;
        setParams(params: Dictionary): void;
    }

    export interface FocusedTabInfo {
        tabId: string;
    }

    export interface WorkspaceAPI {
        openTab: (params: {
            url?: string;
            recordId?: string;
            focus?: boolean;
            overrideNavRules?: boolean;
            pageReference?: Record<string, any>;
        }) => Promise<string>;

        openSubtab: (params: {
            parentTabId: string;
            url?: string;
            recordId?: string;
            focus?: boolean;
            pageReference?: Record<string, any>;
        }) => Promise<string>;

        getFocusedTabInfo: () => Promise<FocusedTabInfo>;

        setTabLabel?: (params: { tabId?: string; label?: string }) => Promise<FocusedTabInfo>;

        setTabIcon?: (params: { tabId?: string; icon?: string; iconAlt?: string }) => Promise<FocusedTabInfo>;
    }

    export interface QuickActionAPIFields {
        [field: string]: { value: string; insertType?: string };
    }

    export interface QuickActionAPIFieldErrors {
        [field: string]: { message: string };
    }

    export interface IQuickActionAPISetActionFieldValuesArg {
        actionName: string;
        targetFields: QuickActionAPIFields;
        parentFields?: QuickActionAPIFields;
        submitOnSuccess?: boolean;
    }

    export interface IQuickActionAPIGetCustomActionArg {
        actionName: string;
    }

    export interface IQuickviewApiGetAvailableActions {
        success: boolean;
        actions: Array<IAvailableQuickAction>;
        errors?: Array<any>;
    }

    export interface IAvailableQuickAction {
        actionName: string;
        recordId: string;
    }
    export interface QuickActionAPI {
        getAvailableActions(): Promise<IQuickviewApiGetAvailableActions>;
        setActionFieldValues: (
            args: IQuickActionAPISetActionFieldValuesArg
        ) => Promise<{
            success: boolean;
            unavailableAction?: boolean;
            targetFieldErrors?: QuickActionAPIFieldErrors;
            errors?: any[];
        }>;
        getCustomAction: (
            args: IQuickActionAPIGetCustomActionArg
        ) => Promise<{
            success: boolean;
            subscribe: () => any;
            publish: () => any;
            unsubscribe: () => any;
            unavailableAction?: boolean;
            errors?: any[];
        }>;
    }

    export interface IConversationToolkitAPISendMessageArg {
        recordId: string;
        message: { text: string };
    }

    export interface IBetaConversationToolkitAPISendMessageArg {
        recordId: string;
        message: string;
    }

    export interface IConversationToolkitAPIGetChatLogArg {
        recordId: string;
    }

    export interface ConversationToolkitAPI {
        sendMessage: (args: IConversationToolkitAPISendMessageArg) => Promise<boolean>;
        getChatLog: (args: IConversationToolkitAPIGetChatLogArg) => Promise<any>;
    }
}

declare let $A: Aura.$A;