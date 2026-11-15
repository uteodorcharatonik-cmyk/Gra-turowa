# ARX — gra turowa 3D

Otwórz `ARX_ARX_25x25_mobile_split.html` w aktualnej przeglądarce z WebGL. Gra pobiera Three.js i PeerJS z CDN, więc potrzebuje internetu. Do gry online obie osoby muszą otworzyć tę samą wersję na hostingu HTTPS.

Lokalny podgląd:

```sh
python -m http.server 8765
```

Następnie otwórz `http://localhost:8765/ARX_ARX_25x25_mobile_split.html`.

## Sterowanie i zasady

- WASD / strzałki / przyciski dotykowe: ruch względem kamery. Kliknięcie sąsiedniego pola: ruch lub atak.
- Przeciąganie: obrót kamery; kółko myszy: przybliżenie; C: zmiana widoku; E: akcje i receptury.
- Tura daje 2 ruchy (+ bonusy amuletów) oraz 2 akcje. Każde zbieranie, wytwarzanie, leczenie, gotowanie, odpoczynek, atak i obrona kosztuje 1 akcję.
- Kilof: 2 drewna + 2 kamienie. Jednorazowe wyposażenie; każde złoże kamienia lub rudy daje 2 sztuki zamiast 1, bez podwajania punktów. Złoże zbiera się raz.
- Obrona: redukuje otrzymane obrażenia o 2 (minimum 1) do rozpoczęcia następnej własnej tury. Nie kumuluje się.
- Ognisko: 2 drewna + 1 kamień, leczy 4 zdrowia przy budowie. Pozostaje na polu i jest dostępne dla wszystkich graczy. Kolejna budowa na tym samym polu jest zablokowana.
- Na polu z ogniskiem można odpocząć (+2 zdrowia) albo zamienić 1 surowe mięso w 1 pieczeń. Pieczeń leczy 6 zdrowia, surowe mięso 3; przy jedzeniu pieczeń ma pierwszeństwo. Maksymalne zdrowie: 10.
- Strażnik Pól stoi na środku mapy w oczyszczonej arenie. Ma 60 HP. Gdy gracze zbliżą się na 3 pola, na końcu tury zapowiada uderzenie. Czerwone pola pokazują zasięg 2 pól (odległość Manhattan). Po następnej turze uderza kończącego ją gracza, jeśli ten nadal stoi w zasięgu. Można uciec lub użyć obrony; pancerz także redukuje obrażenia.
- Przy 30 HP lub mniej boss wpada w furię: uderzenie obszarowe rośnie z 4 do 6 obrażeń, kontratak z 4 do 5. Pokonanie bossa daje 15 punktów i kończy grę; wygrywa osoba z największą liczbą punktów.
- Rozmiar gry to nadal wybrane 25×25, 35×35 lub 50×50 pól. Słupki oznaczają jej granice. Pagórki i góry poza granicami są dekoracją; nie ma tam prostokątnych podkładów ani stożkowatych upraw.

## Łuk, uprawa i sidła

W panelu **Akcje [E]** dostępne są dodatkowe czynności, każda za 1 akcję:

- Łuk: 3 drewna + 1 ruda. Strzela do potworów w odległości 1–3 pól (Manhattan), za 3 obrażenia + ulepszenie broni z szybkiego wytwarzania. Miecz nie zwiększa siły strzału. Z odległości 2–3 pól potwór nie kontratakuje; atak obszarowy bossa nadal działa.
- 4 strzały: 1 drewno + 1 kamień. Każdy strzał zużywa 1 strzałę i 1 akcję. Przycisk **Strzel z łuku** wybiera najbliższego potwora; kliknięcie potwora w odległości 2–3 pól wybiera konkretny cel. Sąsiedniego potwora kliknięcie atakuje mieczem. Łuk przepada po śmierci.
- Zasadź zioła: 1 zioło + 1 drewno na wolnym lub wyeksploatowanym polu, bez ogniska, zwierzęcia ani potwora. Po zakończeniu 2 własnych tur roślina dojrzewa. Wejdź na pole i użyj **Zbierz**, by dostać 3 zioła. Zbiór kosztuje 1 akcję, nie daje punktów i usuwa uprawę. Zebrać może dowolny gracz.
- Sidła: 2 drewna + 1 kamień. Zakładane na najbliższego sąsiedniego potwora, który nie jest jeszcze w sidłach. Następny cios lub strzał dowolnego gracza dostaje +4 obrażenia i zużywa sidła. Efekt nie kumuluje się; oznacza go obręcz u stóp potwora.

## Weryfikacja logiki

Bez dodatkowych zależności, Node.js 18+:

```sh
node --test tests/game.cjs
```

Testy obejmują generowanie bossa i areny, koszty i ograniczenia akcji, kilof, ognisko, gotowanie, leczenie, obronę, atak bossa i furię, zwycięstwo oraz granice mapy. Dodatkowe testy sprawdzają koszty i zasięg łuku, amunicję, dojrzewanie i zbiór ziół, jednorazowe sidła oraz wysokości terenu na wszystkich rozmiarach mapy. Renderowanie i układ paneli wymagają osobnego sprawdzenia w przeglądarce.
