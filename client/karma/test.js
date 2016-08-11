describe("AppUtils", function() {

    var appUtils;

    beforeEach(module('BigScreen.AppShared'));

    beforeEach(inject(function(AppUtils){
        appUtils = AppUtils; 
    }));

    describe('SessionStorage', function(){
        it('set and get', function(){
            appUtils.setSessionItem('test', 'test');
            var output = appUtils.getSessionItem('test');
            expect(output).toEqual('test');
        });
    });
});