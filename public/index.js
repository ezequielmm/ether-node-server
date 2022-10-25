function appendData(data) {
    let html = `<div class="alert alert-success alert-dismissible fade show mt-3">`;
    html += `<button type="button" class="close" data-dismiss="alert">&times;</button>`;
    html += `<code>${data}</code>`;
    html += `</div>`;
    $('#logData').append(html);
}

function showJSON(jsonData) {
    appendData(jsonData);
}

$(document).ready(function () {
    let socket = null;
    let socketUrl = document.getElementById('socketUrl').value;

    $('#btnConnectToSocket').click(function () {
        const token = document.getElementById('authToken').value;

        socket = io(socketUrl, {
            extraHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });

        socket.on('connect', function () {
            appendData('Connected');
        });

        socket.on('disconnect', function () {
            appendData('Disconnected');
        });

        socket.on('PlayerState', (response) => {
            showJSON(response);
        });

        socket.on('ExpeditionMap', (response) => {
            showJSON(response);
        });
    });

    $('#btnSyncExpedition').click(function () {
        socket.emit('SyncExpedition');
    });

    $('#btnSelectNode').click(function () {
        const nodeId = document.getElementById('nodeId').value;

        socket.emit('NodeSelected', parseInt(nodeId), (response) => {
            showJSON(response);
        });
    });
});
