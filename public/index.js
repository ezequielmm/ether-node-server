$(document).ready(function () {
    let socket = null;

    $('#btnConnectToSocket').click(function () {
        const token = document.getElementById('authToken').value;

        socket = io('http://localhost:3000', {
            extraHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });

        socket.on('connect', function () {
            console.log('Connected');
        });

        socket.on('disconnect', function () {
            console.log('Disconnected');
        });
    });
});
