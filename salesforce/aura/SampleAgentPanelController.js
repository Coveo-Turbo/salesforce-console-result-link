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