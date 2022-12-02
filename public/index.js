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

        socket.on('PutData', (response) => {
            showJSON(response);
        });

        socket.on('ErrorMessage', (response) => {
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

    $('#btnPlayCard').click(function () {
        const cardId = document.getElementById('cardId').value;
        const targetId = document.getElementById('targetId').value;

        socket.emit(
            'CardPlayed',
            JSON.stringify({
                cardId,
                targetId,
            }),
            (response) => {
                showJSON(response);
            },
        );
    });

    $('#btnContinueExpedition').click(function () {
        socket.emit('ContinueExpedition', (response) => {
            showJSON(response);
        });
    });

    $('#btnClearConsole').click(function () {
        $('#logData').html('');
    });

    $('#btnGetData').click(function () {
        const key = document.getElementById('getData').value;

        socket.emit('GetData', key, (response) => {
            showJSON(response);
        });
    });

    $('#btnCampRecoverHealth').click(function () {
        socket.emit('CampRecoverHealth', key, (response) => {
            showJSON(response);
        });
    });

    $('#btnEndTurn').click(function () {
        socket.emit('EndTurn');
    });

    $('#btnSelectReward').click(function () {
        const rewardId = document.getElementById('rewardId').value;

        socket.emit('RewardSelected', rewardId, (response) => {
            showJSON(response);
        });
    });

    $('#btnMoveCard').click(function () {
        const cardId = document.getElementById('moveCard').value;

        socket.emit(
            'MoveCard',
            JSON.stringify({ cardToTake: cardId }),
            (response) => {
                showJSON(response);
            },
        );
    });

    $('#btnUsePotion').click(function () {
        const potionId = document.getElementById('potionId').value;

        socket.emit(
            'UsePotion',
            JSON.stringify({ potionId, targetId: null }),
            (response) => {
                showJSON(response);
            },
        );
    });

    $('#btnMerchantBuy').click(function () {
        const targetId = document.getElementById('itemId').value;
        const type = document.getElementById('itemType').value;

        socket.emit(
            'MerchantBuy',
            JSON.stringify({ targetId, type }),
            (response) => {
                showJSON(response);
            },
        );
    });

    $('#btnOpenChest').click(function () {
        socket.emit('ChestOpened', (response) => {
            showJSON(response);
        });
    });

    $('#btnEncounterChoice').click(function () {
        const choiceIdx = document.getElementById('choiceIdx').value;

        socket.emit('EncounterChoice', parseInt(choiceIdx), (response) => {
            showJSON(response);
        });
    });
});
