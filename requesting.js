requestObject = {model: "gpt-4o-2024-08-06", stream: false, messages: [{role: "system", content: "Answer questionnaire ... "}, {role: "user", content: "QUESTIONNAIRE"}]};

async function request(requestObject){
    let response = await fetch('stream-api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestObject),
    });
    let stream = response.body;
    if (!stream) {
        console.error("no stream");
        return;
    }
    const reader = stream.getReader();
    try {

        let incompleteSlice = "";
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                return incompleteSlice;
            }
    
            incompleteSlice += new TextDecoder().decode(value);
        }
    } catch (error) {
        console.error("error $error");
    }
}