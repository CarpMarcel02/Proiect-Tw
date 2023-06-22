const resetRequestForm = document.querySelector(".form-box form");
resetRequestForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = resetRequestForm.querySelector(".email-input input");

    fetch("http://localhost:3000/api/auth/resetPasswordRequest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: emailInput.value,
        }),
    })
    .then((response) =>
        response
        .json()
        .then((data) => ({ status: response.status, body: data }))
    )
    .then((data) => {
        if (data.status !== 200) {
            throw new Error(data.body.message || "Unknown error");
        }

        console.log("Success:", data.body.message);
        alert("Un email a fost trimis cu instrucțiuni de resetare a parolei.")
    })
    .catch((error) => {
        alert("Error: " + error.message);
    });
});