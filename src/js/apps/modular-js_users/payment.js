define(["userProfile", "userSettings"], function(profile, settings) {

    return {
        updateBank: function() {
            console.log("Payment : updateBank");
            profile.update();
            return true;
        }
    };

});
