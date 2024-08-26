questionnaire = `1. What is the overall size of the dog? (Small, Medium, Large, Extra Large)
2. What is the predominant coat length? (Short, Medium, Long, Hairless)
3. What is the coat texture? (Smooth, Curly, Wavy, Rough)
4. What are the primary colors of the dog's coat? (Black, White, Brown, Golden, Brindle)
5. Are there any distinct markings on the dog? (None, Patches, Stripes, Spots)
6. Is the coat solid or does it have patterns? (Solid, Spotted, Striped, Brindle)
7. What is the shape of the dog's ears? (Floppy, Pointed, Semi-erect, Rose)
8. How long are the dog's ears? (Short, Medium, Long)
9. What position do the ears naturally fall in? (Up, Down, Hanging)
10. What is the shape of the dog's head? (Square, Rectangular, Round, Triangular)
11. Does the dog have a pronounced stop? (Yes, No)
12. What is the length of the dog's muzzle? (Short, Medium, Long)
13. Is the dog's muzzle straight or curved? (Straight, Slightly Curved, Convex)
14. What is the color of the dog's nose? (Black, Brown, Pink)
15. Are the eyes round or almond-shaped? (Round, Almond)
16. What colors are visible in the dog's eyes? (Brown, Blue, Amber, Green)
17. Does the dog have different colored eyes? (Yes, No)
18. Does the dog have a long neck or a short neck? (Long, Short)
19. What is the shape of the dog's body? (Athletic, Stocky, Slim)
20. How long is the dog's tail? (Short, Medium, Long, Docked)
21. What is the tail's shape? (Straight, Curled, Feathered)
22. Is the dog's tail docked or natural? (Docked, Natural)
23. What kind of leg structure does the dog have? (Straight, Bowed, Stocky)
24. How thick are the dog's legs? (Thin, Medium, Thick)
25. What is the shape of the dog's paws? (Round, Oval, Square)
26. Are the dog's nails light or dark? (Light, Dark)
27. Does the dog have any unique features? (Yes, No, Whiskers)
28. Does the dog have visible dewclaws? (Yes, No)
29. Is there a difference in fur texture between different body parts? (Yes, No)
30. What is the dog's body shape when viewed from the side? (Straight Back, Sloping, Curved)
31. How prominent are the dog's cheekbones? (Not Prominent, Slightly, Moderate, Very Prominent)
32. Are the dog's ears high-set or low-set? (High, Low)
33. Is the dog's skin loose or tight? (Loose, Tight)
34. What color is the dog's belly or undercoat? (White, Brown, Gray, Black)
35. Does the dog have feathering on its legs or tail? (Yes, No)
36. How dense is the dog's coat? (Thick, Medium, Thin)
37. Does the dog have distinct facial features such as wrinkles or a beard? (Yes, No)
38. What is the shape of the dog's back? (Straight, Arched, Sloping)
39. Does the dog have any visible scars or blemishes? (Yes, No)
40. How visible are the dog's ribs? (Visible, Slightly Visible, Not Visible)
41. Are the dog's eyes set wide apart or close together? (Wide Apart, Close Together)
42. What is the width of the dog's stance? (Narrow, Average, Wide)
43. Is the dog's tail bushy or sleek? (Bushy, Sleek)
44. How does the dog's coat fall? (Flat, Fluffy, Smooth)
45. What is the color of the dog's whiskers? (White, Black, Gray)
46. What is the shape of the dog's snout? (Short, Medium, Long)
47. Does the dog have a pronounced jawline? (Yes, No)
48. How long are the dog's legs in proportion to its body? (Short, Average, Long)
49. Are the dog’s teeth visible when the mouth is closed? (Yes, No)
50. Is the dog’s coat shiny, dull, or textured? (Shiny, Dull, Textured)
`;

const dogBreeds = [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
    "French Bulldog",
    "Bulldog",
    "Poodle",
    "Beagle",
    "Rottweiler",
    "Yorkshire Terrier",
    "Dachshund",
    "Boxer",
    "Siberian Husky",
    "Pembroke Welsh Corgi",
    "Doberman Pinscher",
    "Shih Tzu",
    "Australian Shepherd",
    "Bichon Frise",
    "Cavalier King Charles Spaniel",
    "Miniature Schnauzer",
    "Chihuahua",
    "Pug",
    "Shetland Sheepdog",
    "Boston Terrier",
    "Havanese",
    "Maltese",
    "Cocker Spaniel",
    "Pomeranian",
    "Akita",
    "Basset Hound",
    "Rottweiler",
    "Border Collie",
    "Chow Chow",
    "Great Dane",
    "Newfoundland",
    "Belgian Malinois",
    "Bull Terrier",
    "Samoyed",
    "Tibetan Mastiff",
    "Scottish Terrier",
    "Weimaraner",
    "Vizsla",
    "American Pit Bull Terrier",
    "Alaskan Malamute",
    "Irish Setter",
    "Whippet",
    "English Bulldog",
    "Collie",
    "Australian Cattle Dog",
];

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
              	const data = JSON.parse(incompleteSlice);
               	const content = data.choices[0].message.content;
                return content;
            }
    
            incompleteSlice += new TextDecoder().decode(value);
        }
    } catch (error) {
        console.error("error $error");
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const replys = []
async function executeSequentially() {  
  for (let i = 1; i <= 1000; i++) {
    	let content = "answer this questions in csv format with only one row with answers to this questions for " + dogBreeds[i%50] + " and without any additional text, here are the questions:" + questionnaire
    let requestObject = {model: "gpt-4o-2024-08-06", stream: false, messages: [{role: "system", content: 		 "Hello "}, {role: "user", content: content}]};
    let result = await request(requestObject);
    replys.push(result)
    await delay(1000)
   
}
  console.log('All questions sent');
}

executeSequentially().then(rez => {
  const csvContent = replys.join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'data.csv';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
})

