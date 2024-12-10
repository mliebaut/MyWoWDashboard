document.getElementById('searchButton').addEventListener('click', async () => {
    const characterName = document.getElementById('characterName').value;
    const characterRealm = document.getElementById('characterRealm').value;
    const region = document.getElementById('region').value;
  
    if (!characterName || !characterRealm || !region) {
      alert('Please fill in all fields!');
      return;
    }
  
    try {
      // Remplace l'URL de l'API Blizzard par l'URL de ton backend
      const response = await fetch(`http://localhost:3000/character?characterName=${characterName}&characterRealm=${characterRealm}&region=${region}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const characterData = await response.json();
      console.log(characterData); // Affiche les données dans la console (pour le débogage)
  
      // Afficher les données dans la page
      const characterInfoContainer = document.getElementById('characterInfoContainer');
      characterInfoContainer.innerHTML = `
        <p><strong>Name:</strong> ${characterData.name}</p>
        <p><strong>Realm:</strong> ${characterData.realm.name}</p>
        <p><strong>Faction:</strong> ${characterData.faction.name}</p>
        <p><strong>Level:</strong> ${characterData.level}</p>
        <p><strong>Class:</strong> ${characterData.character_class.name}</p>
        <p><strong>Race:</strong> ${characterData.race.name}</p>
        <p><strong>Item Level:</strong> ${characterData.item_level.average_item_level}</p>
        <img src="${characterData.avatar_url}" alt="Avatar" class="image is-128x128">
      `;
    } catch (error) {
      console.error('Error fetching character data:', error);
      alert(`Error retrieving character data: ${error.message}`);
    }
  });
  