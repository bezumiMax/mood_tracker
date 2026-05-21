function reply(body, response) {
    var replyData = { type: "raw", body: body };
    response.replies = response.replies || [];
    response.replies.push(replyData);
}

function addAction(action, context) {
    var command = {
        type: "smart_app_data",
        action: action
    };
    for (var i = 0; context.response.replies && i < context.response.replies.length; i++) {
        if (
            context.response.replies[i].type === "raw" &&
            context.response.replies[i].body &&
            context.response.replies[i].body.items
        ) {
            context.response.replies[i].body.items.push({ command: command });
            return;
        }
    }
    reply({ items: [{ command: command }] }, context.response);
}

function addSuggestions(suggestions, context) {
    var buttons = suggestions.map(function (s) {
        return { action: { text: s, type: "text" }, title: s };
    });
    for (var i = 0; context.response.replies && i < context.response.replies.length; i++) {
        if (context.response.replies[i].type === "raw" && context.response.replies[i].body) {
            context.response.replies[i].body.suggestions = { buttons: buttons };
            return;
        }
    }
    reply({ suggestions: { buttons: buttons } }, context.response);
}
