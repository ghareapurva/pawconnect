// Replace your entire script section with this code

     // Chatbot functionality with fuzzy matching and synonyms
    document.addEventListener('DOMContentLoaded', function() {
        const chatToggle = document.getElementById('chat-toggle');
        const chatClose = document.getElementById('chat-close');
        const chatbot = document.getElementById('chatbot');
        const chatBody = document.getElementById('chat-body');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        
        // Toggle chatbot visibility
        chatToggle.addEventListener('click', function() {
            chatbot.classList.add('active');
        });
        
        chatClose.addEventListener('click', function() {
            chatbot.classList.remove('active');
        });
        const qaPairs = [
            {
                question: "how often should i feed my dog",
                answer: "Adult dogs typically eat twice daily, while puppies need 3-4 meals. Portion size depends on breed, age, and activity level. Check our Pet Health section for feeding guides."
            },
            {
                question: "what vaccines does my puppy need",
                answer: "Puppies need core vaccines: DHPP (distemper, hepatitis, parainfluenza, parvovirus) and rabies. Your vet will create a vaccination schedule starting at 6-8 weeks."
            },
            {
                question: "how to potty train a puppy",
                answer: "Take puppy outside frequently, especially after eating, drinking, and waking up. Use positive reinforcement with treats and praise for success. Be patient and consistent!"
            },
            {
                question: "is chocolate really bad for dogs",
                answer: "Yes! Chocolate contains theobromine which is toxic to dogs. Dark chocolate is most dangerous. Contact your vet immediately if your dog eats chocolate."
            },
            {
                question: "how often should i bathe my dog",
                answer: "Most dogs need bathing every 4-6 weeks. Over-bathing can strip natural oils. Some breeds with oily coats may need more frequent bathing."
            },
            {
                question: "what should i do if my pet is lost",
                answer: "Immediately search your neighborhood, contact local shelters and vets, post on community boards, and use social media. Check our Lost & Found section to report lost pets."
            },
            {
                question: "how to introduce a new pet to my current pet",
                answer: "Introduce pets slowly in neutral territory. Use positive reinforcement and keep initial interactions short. Gradually increase time together under supervision."
            },
            {
                question: "what are signs of a sick cat",
                answer: "Look for changes in appetite, litter box habits, energy levels, grooming, or behavior. Hiding, vomiting, or vocalizing more can indicate illness."
            },
            {
                question: "how to stop my dog from barking",
                answer: "Identify the trigger first. Use training techniques like the 'quiet' command, distraction, or desensitization. Our Behavior section has detailed guides."
            },
            {
                question: "what human foods are safe for dogs",
                answer: "Some safe options: cooked chicken, carrots, apples (no seeds), plain pumpkin, and plain yogurt. Always avoid onions, garlic, grapes, and chocolate."
            },
            {
                question: "how often should i take my pet to the vet",
                answer: "Annual checkups for healthy adults, every 6 months for seniors, and more frequently for puppies/kittens or pets with health conditions."
            },
            {
                question: "how to trim my pet's nails",
                answer: "Use proper pet nail clippers, avoid the quick (pink area containing blood vessels), and go slowly. Ask your vet to demonstrate if unsure."
            },
            {
                question: "what to do if my pet eats something toxic",
                answer: "Contact your vet or animal poison control immediately! Have the product container handy to identify the toxin. Don't induce vomiting unless instructed."
            },
            {
                question: "how to stop my cat from scratching furniture",
                answer: "Provide appropriate scratching posts, use deterrents on furniture, trim nails regularly, and use positive reinforcement when they use the post."
            },
            {
                question: "what temperature is too hot for dogs",
                answer: "Above 85°F (29°C) can be dangerous, especially with humidity. Never leave pets in parked cars - temperatures can rise rapidly to deadly levels."
            },
            {
                question: "how to travel with a pet",
                answer: "Ensure proper carrier/crate, bring familiar items, research pet-friendly accommodations, and make frequent stops for exercise and bathroom breaks."
            },
            {
                question: "what are the benefits of spaying/neutering",
                answer: "Prevents unwanted litters, reduces risk of certain cancers, can reduce behavioral issues, and may increase lifespan."
            },
            {
                question: "how to clean pet stains from carpet",
                answer: "Blot immediately, use enzyme-based cleaners specifically for pet stains, avoid ammonia-based products which can attract pets back to the same spot."
            },
            {
                question: "what toys are safe for dogs",
                answer: "Choose size-appropriate toys, avoid those that can break into small pieces, and supervise play with chew toys. Rotate toys to maintain interest."
            },
            {
                question: "how to socialize a puppy",
                answer: "Expose to various people, places, and other vaccinated pets in positive ways. Puppy socialization classes are excellent for proper socialization."
            },
            {
                question: "what plants are toxic to cats",
                answer: "Lilies are extremely dangerous! Also avoid: poinsettias, philodendron, ivy, and sago palm. Check our Pet Health section for a complete list."
            },
            {
                question: "how to stop my dog from jumping on people",
                answer: "Turn away and ignore jumping behavior, reward when all four paws are on floor, teach an alternative behavior like 'sit' to greet people."
            },
            {
                question: "what is the best diet for my pet",
                answer: "High-quality commercial food appropriate for your pet's age, size, and health needs. Consult your vet for specific recommendations."
            },
            {
                question: "how to brush my pet's teeth",
                answer: "Use pet-specific toothpaste (never human toothpaste), start slowly with finger brushing, and gradually introduce a pet toothbrush."
            },
            {
                question: "what to do if I find a stray animal",
                answer: "Check for identification, contact local animal control or shelters, and post found notices. You can also check our Lost & Found section."
            },
            {
                question: "how to keep my pet cool in summer",
                answer: "Provide plenty of fresh water, shade, avoid exercising during hottest hours, and consider cooling mats or vests for extreme heat."
            },
            {
                question: "what are signs of dental problems in pets",
                answer: "Bad breath, difficulty eating, pawing at mouth, drooling, or visible tartar buildup. Regular dental checkups are important."
            },
            {
                question: "how to stop my cat from biting",
                answer: "Redirect to appropriate toys, avoid using hands as toys, and provide plenty of play opportunities with interactive toys."
            },
            {
                question: "what flea treatment is best for my pet",
                answer: "Consult your vet for recommendations based on your pet's age, species, and health status. Never use dog products on cats."
            },
            {
                question: "how to help a scared pet during fireworks",
                answer: "Create a safe space, use white noise or calming music, consider anxiety wraps, and in severe cases, ask your vet about anti-anxiety options."
            },
            {
                question: "what are common household dangers for pets",
                answer: "Electrical cords, toxic plants, human medications, cleaning products, and small objects that can be swallowed. Pet-proof your home!"
            },
            {
                question: "how to stop my dog from digging",
                answer: "Provide more exercise, create a designated digging area with sand or loose soil, and ensure they're not digging out of boredom."
            },
            {
                question: "what should I include in a pet first aid kit",
                answer: "Gauze, adhesive tape, antiseptic wipes, thermometer, tweezers, saline solution, and your vet's emergency contact information."
            },
            {
                question: "how to tell if my pet is overweight",
               answer: "You should be able to feel but not see their ribs. From above, you should see a waist behind the ribs. Consult your vet for a body condition score."
            },
            {
                question: "what to do if my pet has a seizure",
                answer: "Keep calm, move objects away to prevent injury, time the seizure, and contact your vet immediately. Never put anything in their mouth."
            },
            {
                question: "how to stop my cat from waking me up",
                answer: "Ignore the behavior, provide interactive toys for nighttime, and establish a consistent feeding schedule that doesn't reward early waking."
            },
            {
                question: "what are the costs of pet ownership",
                answer: "Food, veterinary care, grooming, toys, and supplies typically cost $500-$1000 annually. Emergency care can add significant additional costs."
            },
            {
                question: "how to help my pet with arthritis",
                answer: "Provide orthopedic bedding, ramps for furniture, maintain healthy weight, and ask your vet about joint supplements or pain management options."
            },
            {
                question: "what is pet insurance and do I need it",
                answer: "Pet insurance helps cover unexpected veterinary costs. It can be valuable for emergency care but may not cover pre-existing conditions."
            },
            {
                question: "how to stop my dog from pulling on leash",
                answer: "Stop walking when they pull, change direction frequently, and reward when leash is loose. Consider front-clip harnesses for better control."
            },
            {
                question: "what are the best pets for apartments",
                answer: "Cats, small dogs, rabbits, or birds can adapt well to apartment living. Consider energy level and noise when choosing a pet."
            },
            {
                question: "how to care for a senior pet",
                answer: "More frequent vet checkups, appropriate diet for age, comfortable bedding, and accommodations for reduced mobility or vision/hearing loss."
            },
            {
                question: "what to do if my pet stops eating",
                answer: "Monitor for other symptoms, try offering different foods, and contact your vet if refusal lasts more than 24 hours or if other symptoms appear."
            },
            {
                question: "how to stop my cat from spraying",
                answer: "Rule out medical issues first, then address stress factors, ensure litter box cleanliness, and consider pheromone diffusers to reduce anxiety."
            },
            {
                question: "what are the benefits of adopting from a shelter",
                answer: "You save a life, often get a vaccinated and spayed/neutered pet, and support important animal welfare work in your community."
            },
            {
                question: "how to keep my pet safe during holidays",
                answer: "Secure Christmas trees, keep toxic foods out of reach, provide quiet spaces away from guests, and ensure pets can't escape through frequently opened doors."
            },
            {
                question: "what should I know about pet euthanasia",
                answer: "It's a compassionate choice to end suffering when quality of life is poor. Discuss options with your vet, who can help you make this difficult decision."
            },
            {
                question: "how to prepare for a new pet",
                answer: "Pet-proof your home, gather supplies (food, bowls, bed, toys), find a vet, and prepare all family members for the new responsibilities."
            },
            {
                question: "what are signs of a healthy pet",
                answer: "Bright eyes, clean ears, shiny coat, good appetite, normal energy levels, and regular bathroom habits. Regular vet checkups confirm overall health."
            },
            {
        question: "how to help stray dogs in my area",
        answer: "Contact local animal welfare organizations, provide food/water, and report to animal control. Consider volunteering with rescue groups or fostering if possible."
    },
    {
        question: "what to do if I find an injured stray animal",
        answer: "Contact local animal rescue immediately. Keep the animal warm and quiet, but avoid handling if it might bite. If safe, transport to a vet or shelter."
    },
    {
        question: "how to safely approach a stray dog",
        answer: "Move slowly, avoid direct eye contact, don't make sudden movements. Let the dog approach you first. Offer food but keep your hands protected."
    },
    {
        question: "what are common diseases in stray animals",
        answer: "Parvovirus, distemper, rabies, mange, intestinal parasites, and upper respiratory infections are common. Isolate from other pets until vet-checked."
    },
    {
        question: "how to build a shelter for stray cats",
        answer: "Use plastic storage bins with insulation, straw bedding (not hay), and elevated placement. Keep entrances small to retain heat and deter predators."
    },
    {
        question: "what is TNR for feral cats",
        answer: "Trap-Neuter-Return: Humanely trap cats, spay/neuter them, vaccinate, ear-tip for identification, and return to their territory to live out their lives."
    },
    {
        question: "how to report animal cruelty",
        answer: "Contact local animal control, police department, or animal welfare organizations. Document evidence with photos/videos if safe to do so."
    },
    {
        question: "what to feed a rescued malnourished dog",
        answer: "Start with small, frequent meals of high-quality puppy food soaked in warm water. Sudden rich food can cause refeeding syndrome - consult a vet."
    },
    {
        question: "how to help scared rescue dogs adjust",
        answer: "Provide a quiet space, establish routine, use positive reinforcement, be patient, and allow the dog to approach you on their terms."
    },
    {
        question: "what are signs of mange in dogs",
        answer: "Hair loss, intense itching, red skin, scabs, and crusting. Demodectic and sarcoptic mange require different treatments - see a vet for diagnosis."
    },
    {
        question: "how to identify rabies symptoms",
        answer: "Behavior changes, aggression, drooling, difficulty swallowing, paralysis. If you suspect rabies, avoid contact and call animal control immediately."
    },
    {
        question: "what to do with orphaned kittens",
        answer: "Assess if mother is truly gone (wait nearby). If truly orphaned, keep warm, feed kitten milk replacer every 2-3 hours, and stimulate elimination after feeding."
    },
    {
        question: "how to treat flea infestation in strays",
        answer: "Use veterinarian-approved flea treatments. Avoid over-the-counter products which can be toxic. For severe cases, medicated baths may be necessary."
    },
    {
        question: "what is parvo in dogs",
        answer: "Highly contagious viral disease causing vomiting, bloody diarrhea, dehydration, and often fatal without treatment. Vaccination prevents it."
    },
    {
        question: "how to disinfect areas after parvo",
        answer: "Use bleach solution (1:32 dilution), potassium peroxymonosulfate, or accelerated hydrogen peroxide. The virus can survive in environment for months."
    },
    {
        question: "what are symptoms of distemper",
        answer: "Fever, nasal discharge, coughing, lethargy, vomiting, diarrhea, seizures, and neurological signs. Often fatal, vaccination is crucial prevention."
    },
    {
        question: "how to check for dehydration in pets",
        answer: "Gently pinch skin on neck - if it doesn't snap back quickly, they're dehydrated. Also check gum moisture and capillary refill time."
    },
    {
        question: "what to do for pet heatstroke",
        answer: "Move to cool area, apply cool (not cold) water, offer small drinks, use fan, and get to vet immediately - heatstroke can cause organ damage."
    },
    {
        question: "how to make homemade pet food",
        answer: "Consult vet for balanced recipes. Generally include protein source, carbohydrates, vegetables, and supplements. Avoid onions, garlic, grapes, raisins."
    },
    {
        question: "what human foods are toxic to cats",
        answer: "Onions, garlic, chocolate, alcohol, caffeine, grapes, raisins, raw dough, and xylitol. Many lilies are also extremely toxic to cats."
    },
    {
        question: "is grain-free food better for dogs",
        answer: "Not necessarily. Recent studies link some grain-free diets to heart disease (DCM). Consult your vet about the best diet for your specific dog."
    },
    {
        question: "how much should I feed my dog",
        answer: "Follow guidelines on food packaging adjusted for your dog's age, activity level, and metabolism. Regular weight checks help determine proper amount."
    },
    {
        question: "what is raw diet for pets",
        answer: "Feeding raw meat, bones, and organs. Controversial due to bacterial risks and nutritional imbalances. Consult vet before starting raw diet."
    },
    {
        question: "how to transition to new pet food",
        answer: "Mix increasing amounts of new food with decreasing old food over 7-10 days. Sudden changes can cause digestive upset."
    },
    {
        question: "what are best foods for senior dogs",
        answer: "Lower calorie, higher fiber, with joint supplements like glucosamine. May need specialized diets for kidney, heart, or other age-related conditions."
    },
    {
        question: "how to store pet food properly",
        answer: "Keep in original bag inside airtight container in cool, dry place. Wash container between bags. Discard expired food."
    },
    {
        question: "what are symptoms of food allergies in dogs",
        answer: "Itchy skin, ear infections, paw licking, gastrointestinal upset, and chronic gas. Protein sources are most common allergens."
    },
    {
        question: "how to do elimination diet for allergies",
        answer: "Feed novel protein and carbohydrate source for 8-12 weeks, then gradually reintroduce ingredients to identify triggers. Requires vet guidance."
    },
    {
        question: "what is pancreatitis in dogs",
        answer: "Inflammation of pancreas often triggered by high-fat foods. Symptoms include vomiting, abdominal pain, and lethargy. Requires immediate vet care."
    },
    {
        question: "why is my dog vomiting yellow bile",
        answer: "Often occurs when stomach is empty too long. Try feeding smaller, more frequent meals. If persistent, could indicate other issues - consult vet."
    },
    {
        question: "what causes diarrhea in pets",
        answer: "Diet changes, parasites, infections, stress, or serious illnesses. Withhold food for 12-24 hours (not water), then bland diet. See vet if persists >24h."
    },
    {
        question: "why is my cat coughing",
        answer: "Hairballs, asthma, respiratory infections, heart disease, or foreign objects. Persistent coughing needs veterinary evaluation."
    },
    {
        question: "what are symptoms of UTI in cats",
        answer: "Frequent urination, crying in litter box, blood in urine, urinating outside box, and excessive licking of genital area. Requires prompt treatment."
    },
    {
        question: "why is my dog limping",
        answer: "Injury, arthritis, paw problems, or joint issues. Restrict activity and see vet if limping persists more than 24 hours or if severe."
    },
    {
        question: "what causes seizures in dogs",
        answer: "Epilepsy, toxins, metabolic disorders, brain tumors, or infections. Note duration and characteristics to help vet with diagnosis."
    },
    {
        question: "why is my pet shaking",
        answer: "Pain, fear, cold, or neurological issues. Context matters - if accompanied by other symptoms or persistent, veterinary evaluation needed."
    },
    {
        question: "what are signs of kidney failure in cats",
        answer: "Increased thirst, weight loss, poor appetite, vomiting, and bad breath. Common in older cats, requires blood tests for diagnosis."
    },
    {
        question: "why is my dog drinking so much water",
        answer: "Diabetes, kidney disease, Cushing's disease, or urinary tract infection. Excessive drinking always warrants veterinary investigation."
    },
    {
        question: "what causes hair loss in pets",
        answer: "Allergies, parasites, hormonal imbalances, or stress. Pattern and location of hair loss help determine cause."
    },
    {
        question: "why is my cat sneezing",
        answer: "Upper respiratory infection, allergies, or foreign material. If accompanied by discharge or lethargy, veterinary care needed."
    },
    {
        question: "what are symptoms of heartworm",
        answer: "Coughing, exercise intolerance, weight loss, and difficulty breathing. Prevention is crucial as treatment is risky and expensive."
    },
    {
        question: "why is my pet scratching ears",
        answer: "Ear mites, yeast or bacterial infections, allergies, or foreign objects. Ear problems can become serious if left untreated."
    },
    {
        question: "what causes bad breath in dogs",
        answer: "Dental disease is most common. Also could indicate diabetes, kidney disease, or digestive issues. Regular dental care is important."
    },
    {
        question: "why is my pet losing weight",
        answer: "Dental problems, parasites, metabolic diseases, or serious illnesses. Unexplained weight loss always requires veterinary attention."
    },
    {
        question: "what are symptoms of diabetes in cats",
        answer: "Increased thirst, increased urination, weight loss despite good appetite, and weakness. Managed with insulin and diet changes."
    },
    {
        question: "why is my dog panting excessively",
        answer: "Heat, pain, anxiety, or respiratory/cardiac issues. Context matters - emergency if accompanied by pale gums or distress."
    },
    {
        question: "what causes eye discharge in pets",
        answer: "Infections, allergies, corneal ulcers, or blocked tear ducts. Squinting or red eyes need prompt veterinary attention."
    },
    {
        question: "why is my cat hiding",
        answer: "Illness, pain, stress, or fear. Sudden hiding behavior in normally social cats warrants health check."
    },
    {
        question: "what are emergency symptoms in pets",
        answer: "Difficulty breathing, seizures, uncontrolled bleeding, collapse, unable to urinate, distended abdomen, or trauma. Seek immediate veterinary care."
    },

    {
        question: "how to help stray dogs in my area",
        answer: "Contact local animal welfare organizations, provide food/water, and report to animal control. Consider volunteering with rescue groups or fostering if possible."
    },
    {
        question: "what to do if I find an injured stray animal",
        answer: "Contact local animal rescue immediately. Keep the animal warm and quiet, but avoid handling if it might bite. If safe, transport to a vet or shelter."
    },
    {
        question: "how to safely approach a stray dog",
        answer: "Move slowly, avoid direct eye contact, don't make sudden movements. Let the dog approach you first. Offer food but keep your hands protected."
    },
    {
        question: "what are common diseases in stray animals",
        answer: "Parvovirus, distemper, rabies, mange, intestinal parasites, and upper respiratory infections are common. Isolate from other pets until vet-checked."
    },
    {
        question: "how to build a shelter for stray cats",
        answer: "Use plastic storage bins with insulation, straw bedding (not hay), and elevated placement. Keep entrances small to retain heat and deter predators."
    },
    {
        question: "what is TNR for feral cats",
        answer: "Trap-Neuter-Return: Humanely trap cats, spay/neuter them, vaccinate, ear-tip for identification, and return to their territory to live out their lives."
    },
    {
        question: "how to report animal cruelty",
        answer: "Contact local animal control, police department, or animal welfare organizations. Document evidence with photos/videos if safe to do so."
    },
    {
        question: "what to feed a rescued malnourished dog",
        answer: "Start with small, frequent meals of high-quality puppy food soaked in warm water. Sudden rich food can cause refeeding syndrome - consult a vet."
    },
    {
        question: "how to help scared rescue dogs adjust",
        answer: "Provide a quiet space, establish routine, use positive reinforcement, be patient, and allow the dog to approach you on their terms."
    },
    {
        question: "what are signs of mange in dogs",
        answer: "Hair loss, intense itching, red skin, scabs, and crusting. Demodectic and sarcoptic mange require different treatments - see a vet for diagnosis."
    },
    {
        question: "how to identify rabies symptoms",
        answer: "Behavior changes, aggression, drooling, difficulty swallowing, paralysis. If you suspect rabies, avoid contact and call animal control immediately."
    },
    {
        question: "what to do with orphaned kittens",
        answer: "Assess if mother is truly gone (wait nearby). If truly orphaned, keep warm, feed kitten milk replacer every 2-3 hours, and stimulate elimination after feeding."
    },
    {
        question: "how to treat flea infestation in strays",
        answer: "Use veterinarian-approved flea treatments. Avoid over-the-counter products which can be toxic. For severe cases, medicated baths may be necessary."
    },
    {
        question: "what is parvo in dogs",
        answer: "Highly contagious viral disease causing vomiting, bloody diarrhea, dehydration, and often fatal without treatment. Vaccination prevents it."
    },
    {
        question: "how to disinfect areas after parvo",
        answer: "Use bleach solution (1:32 dilution), potassium peroxymonosulfate, or accelerated hydrogen peroxide. The virus can survive in environment for months."
    },
    {
        question: "what are symptoms of distemper",
        answer: "Fever, nasal discharge, coughing, lethargy, vomiting, diarrhea, seizures, and neurological signs. Often fatal, vaccination is crucial prevention."
    },
    {
        question: "how to check for dehydration in pets",
        answer: "Gently pinch skin on neck - if it doesn't snap back quickly, they're dehydrated. Also check gum moisture and capillary refill time."
    },
    {
        question: "what to do for pet heatstroke",
        answer: "Move to cool area, apply cool (not cold) water, offer small drinks, use fan, and get to vet immediately - heatstroke can cause organ damage."
    },
    {
        question: "how to make homemade pet food",
        answer: "Consult vet for balanced recipes. Generally include protein source, carbohydrates, vegetables, and supplements. Avoid onions, garlic, grapes, raisins."
    },
    {
        question: "what human foods are toxic to cats",
        answer: "Onions, garlic, chocolate, alcohol, caffeine, grapes, raisins, raw dough, and xylitol. Many lilies are also extremely toxic to cats."
    },
    {
        question: "is grain-free food better for dogs",
        answer: "Not necessarily. Recent studies link some grain-free diets to heart disease (DCM). Consult your vet about the best diet for your specific dog."
    },
    {
        question: "how much should I feed my dog",
        answer: "Follow guidelines on food packaging adjusted for your dog's age, activity level, and metabolism. Regular weight checks help determine proper amount."
    },
    {
        question: "what is raw diet for pets",
        answer: "Feeding raw meat, bones, and organs. Controversial due to bacterial risks and nutritional imbalances. Consult vet before starting raw diet."
    },
    {
        question: "how to transition to new pet food",
        answer: "Mix increasing amounts of new food with decreasing old food over 7-10 days. Sudden changes can cause digestive upset."
    },
    {
        question: "what are best foods for senior dogs",
        answer: "Lower calorie, higher fiber, with joint supplements like glucosamine. May need specialized diets for kidney, heart, or other age-related conditions."
    },
    {
        question: "how to store pet food properly",
        answer: "Keep in original bag inside airtight container in cool, dry place. Wash container between bags. Discard expired food."
    },
    {
        question: "what are symptoms of food allergies in dogs",
        answer: "Itchy skin, ear infections, paw licking, gastrointestinal upset, and chronic gas. Protein sources are most common allergens."
    },
    {
        question: "how to do elimination diet for allergies",
        answer: "Feed novel protein and carbohydrate source for 8-12 weeks, then gradually reintroduce ingredients to identify triggers. Requires vet guidance."
    },
    {
        question: "what is pancreatitis in dogs",
        answer: "Inflammation of pancreas often triggered by high-fat foods. Symptoms include vomiting, abdominal pain, and lethargy. Requires immediate vet care."
    },
    {
        question: "why is my dog vomiting yellow bile",
        answer: "Often occurs when stomach is empty too long. Try feeding smaller, more frequent meals. If persistent, could indicate other issues - consult vet."
    },
    {
        question: "what causes diarrhea in pets",
        answer: "Diet changes, parasites, infections, stress, or serious illnesses. Withhold food for 12-24 hours (not water), then bland diet. See vet if persists >24h."
    },
    {
        question: "why is my cat coughing",
        answer: "Hairballs, asthma, respiratory infections, heart disease, or foreign objects. Persistent coughing needs veterinary evaluation."
    },
    {
        question: "what are symptoms of UTI in cats",
        answer: "Frequent urination, crying in litter box, blood in urine, urinating outside box, and excessive licking of genital area. Requires prompt treatment."
    },
    {
        question: "why is my dog limping",
        answer: "Injury, arthritis, paw problems, or joint issues. Restrict activity and see vet if limping persists more than 24 hours or if severe."
    },
    {
        question: "what causes seizures in dogs",
        answer: "Epilepsy, toxins, metabolic disorders, brain tumors, or infections. Note duration and characteristics to help vet with diagnosis."
    },
    {
        question: "why is my pet shaking",
        answer: "Pain, fear, cold, or neurological issues. Context matters - if accompanied by other symptoms or persistent, veterinary evaluation needed."
    },
    {
        question: "what are signs of kidney failure in cats",
        answer: "Increased thirst, weight loss, poor appetite, vomiting, and bad breath. Common in older cats, requires blood tests for diagnosis."
    },
    {
        question: "why is my dog drinking so much water",
        answer: "Diabetes, kidney disease, Cushing's disease, or urinary tract infection. Excessive drinking always warrants veterinary investigation."
    },
    {
        question: "what causes hair loss in pets",
        answer: "Allergies, parasites, hormonal imbalances, or stress. Pattern and location of hair loss help determine cause."
    },
    {
        question: "why is my cat sneezing",
        answer: "Upper respiratory infection, allergies, or foreign material. If accompanied by discharge or lethargy, veterinary care needed."
    },
    {
        question: "what are symptoms of heartworm",
        answer: "Coughing, exercise intolerance, weight loss, and difficulty breathing. Prevention is crucial as treatment is risky and expensive."
    },
    {
        question: "why is my pet scratching ears",
        answer: "Ear mites, yeast or bacterial infections, allergies, or foreign objects. Ear problems can become serious if left untreated."
    },
    {
        question: "what causes bad breath in dogs",
        answer: "Dental disease is most common. Also could indicate diabetes, kidney disease, or digestive issues. Regular dental care is important."
    },
    {
        question: "why is my pet losing weight",
        answer: "Dental problems, parasites, metabolic diseases, or serious illnesses. Unexplained weight loss always requires veterinary attention."
    },
    {
        question: "what are symptoms of diabetes in cats",
        answer: "Increased thirst, increased urination, weight loss despite good appetite, and weakness. Managed with insulin and diet changes."
    },
    {
        question: "why is my dog panting excessively",
        answer: "Heat, pain, anxiety, or respiratory/cardiac issues. Context matters - emergency if accompanied by pale gums or distress."
    },
    {
        question: "what causes eye discharge in pets",
        answer: "Infections, allergies, corneal ulcers, or blocked tear ducts. Squinting or red eyes need prompt veterinary attention."
    },
    {
        question: "why is my cat hiding",
        answer: "Illness, pain, stress, or fear. Sudden hiding behavior in normally social cats warrants health check."
    },
    {
        question: "what are emergency symptoms in pets",
        answer: "Difficulty breathing, seizures, uncontrolled bleeding, collapse, unable to urinate, distended abdomen, or trauma. Seek immediate veterinary care."
    }
        ];

        // Find the best answer for a question
        function findAnswer(question) {
            const lowerQuestion = question.toLowerCase();
            
            // Exact match
            for (const pair of qaPairs) {
                if (lowerQuestion.includes(pair.question)) {
                    return pair.answer;
                }
            }
            
            // Keyword matching for common questions
            if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
                return "Hello! I'm PawBot, your pet care assistant. How can I help you today?";
            }
            
            if (lowerQuestion.includes('thank')) {
                return "You're welcome! Is there anything else I can help with?";
            }
            
            if (lowerQuestion.includes('bye') || lowerQuestion.includes('goodbye')) {
                return "Goodbye! Thanks for chatting with me. Visit our website for more pet care resources!";
            }
            
            if (lowerQuestion.includes('adopt') || lowerQuestion.includes('adoption')) {
                return "We have many pets waiting for loving homes! Check our Adoption section to browse available pets and learn about the adoption process.";
            }
            
            if (lowerQuestion.includes('vet') || lowerQuestion.includes('veterinarian')) {
                return "You can find trusted veterinarians in our Vet Listings section. We have reviews and contact information for clinics in your area.";
            }
            
            if (lowerQuestion.includes('emergency') || lowerQuestion.includes('urgent')) {
                return "For emergencies, please contact a veterinarian immediately! Check our Emergency Alerts section for urgent resources and nearby emergency clinics.";
            }
            
            if (lowerQuestion.includes('behavior') || lowerQuestion.includes('training')) {
                return "We have extensive resources in our Pet Behavior section, including training guides and tips for common behavior issues.";
            }
            
            if (lowerQuestion.includes('health') || lowerQuestion.includes('sick')) {
                return "For health concerns, I recommend consulting with a veterinarian. You can also check our Pet Health section for general information and guides.";
            }
            
            // Default response for unrecognized questions
            return "I'm not sure how to answer that. You might find information about that topic in our Pet Health, Behavior, or Adoption sections. Is there something else I can help with?";
        }

        // Send message function
        function sendMessage() {
            const message = userInput.value.trim();
            if (message) {
                // Add user message
                const userMsg = document.createElement('div');
                userMsg.className = 'user-msg';
                userMsg.innerHTML = `<div class="msg-content"><p>${message}</p></div>`;
                chatBody.appendChild(userMsg);

                // Clear input
                userInput.value = '';

                // Scroll to bottom
                chatBody.scrollTop = chatBody.scrollHeight;

                // Show "typing..." indicator
                const typingIndicator = document.createElement('div');
                typingIndicator.className = 'bot-msg';
                typingIndicator.innerHTML = `<div class="msg-content"><p>PawBot is typing...</p></div>`;
                chatBody.appendChild(typingIndicator);
                chatBody.scrollTop = chatBody.scrollHeight;

                // Simulate typing delay
                setTimeout(() => {
                    // Get response
                    const response = findAnswer(message);
                    
                    // Remove typing indicator
                    chatBody.removeChild(typingIndicator);
                    
                    // Add bot response
                    const botMsg = document.createElement('div');
                    botMsg.className = 'bot-msg';
                    botMsg.innerHTML = `<div class="msg-content"><p>${response}</p></div>`;
                    chatBody.appendChild(botMsg);
                    
                    // Scroll to bottom again
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 1000);
            }
        }

        // Trigger send on button click
        sendBtn.addEventListener('click', sendMessage);

        // Trigger send on Enter key
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    });

    // Synonym dictionary for common pet-related terms
        const synonyms = {
            'dog': ['dog', 'puppy', 'canine', 'pooch', 'doggy'],
            'cat': ['cat', 'kitten', 'feline', 'kitty'],
            'feed': ['feed', 'food', 'eating', 'diet', 'nutrition', 'meal'],
            'vaccine': ['vaccine', 'vaccination', 'shot', 'immunization'],
            'potty': ['potty', 'bathroom', 'toilet', 'restroom', 'pee', 'poop'],
            'vet': ['vet', 'veterinarian', 'animal doctor', 'vet clinic'],
            'adopt': ['adopt', 'adoption', 'rescue', 'foster'],
            'behavior': ['behavior', 'behaviour', 'training', 'obedience'],
            'health': ['health', 'sick', 'illness', 'disease', 'medical'],
            'emergency': ['emergency', 'urgent', 'critical', 'immediate help']
        };

        // Function to find similar words using Levenshtein distance
        function findSimilarWord(inputWord, wordList, threshold = 0.7) {
            if (wordList.includes(inputWord)) return inputWord;
            
            let bestMatch = '';
            let bestScore = 0;
            
            for (const word of wordList) {
                const score = stringSimilarity(inputWord, word);
                if (score > bestScore && score >= threshold) {
                    bestScore = score;
                    bestMatch = word;
                }
            }
            
            return bestMatch;
        }

        // Simple string similarity function (0 to 1)
        function stringSimilarity(str1, str2) {
            const longer = str1.length > str2.length ? str1 : str2;
            const shorter = str1.length > str2.length ? str2 : str1;
            
            if (longer.length === 0) return 1.0;
            
            return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length);
        }

        // Edit distance calculation (Levenshtein distance)
        function editDistance(s1, s2) {
            s1 = s1.toLowerCase();
            s2 = s2.toLowerCase();
            
            const costs = [];
            for (let i = 0; i <= s1.length; i++) {
                let lastValue = i;
                for (let j = 0; j <= s2.length; j++) {
                    if (i === 0) {
                        costs[j] = j;
                    } else {
                        if (j > 0) {
                            let newValue = costs[j - 1];
                            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                                newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                            }
                            costs[j - 1] = lastValue;
                            lastValue = newValue;
                        }
                    }
                }
                if (i > 0) costs[s2.length] = lastValue;
            }
            return costs[s2.length];
        }

        // Expand query with synonyms
        function expandQueryWithSynonyms(query) {
            const words = query.split(' ');
            const expandedQuery = [query];
            
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                for (const [key, synonymList] of Object.entries(synonyms)) {
                    if (synonymList.includes(word)) {
                        for (const synonym of synonymList) {
                            if (synonym !== word) {
                                const newWords = [...words];
                                newWords[i] = synonym;
                                expandedQuery.push(newWords.join(' '));
                            }
                        }
                    }
                }
            }
            
            return expandedQuery;
        }

        // Find the best answer for a question with fuzzy matching
        function findAnswer(question) {
            const lowerQuestion = question.toLowerCase().trim();
            
            // Check for exact match first
            for (const pair of qaPairs) {
                if (lowerQuestion === pair.question.toLowerCase()) {
                    return pair.answer;
                }
            }
            
            // Expand query with synonyms
            const expandedQueries = expandQueryWithSynonyms(lowerQuestion);
            
            // Check for matches with expanded queries
            let bestMatch = null;
            let bestScore = 0;
            
            for (const expandedQuery of expandedQueries) {
                for (const pair of qaPairs) {
                    const score = stringSimilarity(expandedQuery, pair.question);
                    if (score > bestScore && score >= 0.6) { // Lower threshold for fuzzy matching
                        bestScore = score;
                        bestMatch = pair.answer;
                    }
                }
            }
            
            if (bestMatch) {
                return bestMatch;
            }
            
            // Keyword matching for common questions as fallback
            if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
                return "Hello! I'm PawBot, your pet care assistant. How can I help you today?";
            }
            
            if (lowerQuestion.includes('thank')) {
                return "You're welcome! Is there anything else I can help with?";
            }
            
            if (lowerQuestion.includes('bye') || lowerQuestion.includes('goodbye')) {
                return "Goodbye! Thanks for chatting with me. Visit our website for more pet care resources!";
            }
            
            // Category-based responses for unrecognized but related questions
            if (lowerQuestion.includes('dog') || lowerQuestion.includes('puppy') || lowerQuestion.includes('canine')) {
                return "I'd be happy to help with dog-related questions! Could you provide more details about what you need to know?";
            }
            
            if (lowerQuestion.includes('cat') || lowerQuestion.includes('kitten') || lowerQuestion.includes('feline')) {
                return "I can help with cat care questions! Could you tell me more specifically what you're wondering about?";
            }
            
            if (lowerQuestion.includes('food') || lowerQuestion.includes('feed') || lowerQuestion.includes('diet') || lowerQuestion.includes('eat')) {
                return "For specific feeding questions, it's best to consult your vet as nutritional needs vary by pet. I can tell you that most adult dogs do well with two meals daily, while puppies need more frequent feeding.";
            }
            
            if (lowerQuestion.includes('vaccin') || lowerQuestion.includes('shot') || lowerQuestion.includes('immuniz')) {
                return "Vaccination schedules depend on your pet's age, species, and local regulations. Puppies and kittens typically start vaccines at 6-8 weeks. Your vet can provide the best schedule for your pet.";
            }
            
            if (lowerQuestion.includes('health') || lowerQuestion.includes('sick') || lowerQuestion.includes('vet') || lowerQuestion.includes('ill')) {
                return "For health concerns, I always recommend consulting with a veterinarian for proper diagnosis and treatment. You can find trusted vets in our Vet Listings section.";
            }
            
            if (lowerQuestion.includes('behavior') || lowerQuestion.includes('train') || lowerQuestion.includes('obedience')) {
                return "We have extensive resources in our Pet Behavior section for training and behavior issues. The approach often depends on your specific situation and pet's temperament.";
            }
            
            if (lowerQuestion.includes('adopt') || lowerQuestion.includes('rescue') || lowerQuestion.includes('shelter')) {
                return "We have many pets waiting for loving homes! Check our Adoption section to browse available pets and learn about the adoption process.";
            }
            
            // Default response for unrecognized questions
            return "I'm not sure I understand. Could you try rephrasing your question? You might also find information about that topic in our Pet Health, Behavior, or Adoption sections.";
        }

        // Send message function
        function sendMessage() {
            const message = userInput.value.trim();
            if (message) {
                // Add user message
                const userMsg = document.createElement('div');
                userMsg.className = 'user-msg';
                userMsg.innerHTML = `<div class="msg-content"><p>${message}</p></div>`;
                chatBody.appendChild(userMsg);

                // Clear input
                userInput.value = '';

                // Scroll to bottom
                chatBody.scrollTop = chatBody.scrollHeight;

                // Show "typing..." indicator
                const typingIndicator = document.createElement('div');
                typingIndicator.className = 'bot-msg';
                typingIndicator.innerHTML = `<div class="msg-content"><p>PawBot is typing...</p></div>`;
                chatBody.appendChild(typingIndicator);
                chatBody.scrollTop = chatBody.scrollHeight;

                // Simulate typing delay
                setTimeout(() => {
                    // Get response
                    const response = findAnswer(message);
                    
                    // Remove typing indicator
                    chatBody.removeChild(typingIndicator);
                    
                    // Add bot response
                    const botMsg = document.createElement('div');
                    botMsg.className = 'bot-msg';
                    botMsg.innerHTML = `<div class="msg-content"><p>${response}</p></div>`;
                    chatBody.appendChild(botMsg);
                    
                    // Scroll to bottom again
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 1000);
            }
        }

        // Trigger send on button click
        sendBtn.addEventListener('click', sendMessage);

        // Trigger send on Enter key
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    