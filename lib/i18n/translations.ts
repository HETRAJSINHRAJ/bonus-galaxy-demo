export type Locale = "de" | "en"

export const translations = {
  de: {
    // Navbar
    nav: {
      home: "Startseite",
      story: "Story",
      contact: "Kontakt",
      privacy: "Datenschutz",
    },
    // Hero Section
    hero: {
      bigWin: "Hauptgewinn",
      yearsOf: "30 Jahre",
      hotelLuxury: "4-Sterne Hotel Luxus",
      coming: "Kommt 2026",
      joinThe: "Werde Teil der",
      galacticExpedition: "Galaktischen Expedition",
      subtitle:
        "Captain Klaus und seine Crew an Bord der Nebukadneza brauchen deine Hilfe. Verwandle alltägliche Aktionen in intergalaktische Abenteuer.",
      missionCommander: "Missionskommandant",
      ourStory: "Unsere Story",
    },
    // Crew Section
    crew: {
      title: "Die Crew",
      subtitle: "Triff die Helden, die diese galaktische Mission möglich machen",
      meetExplorers: "Triff deine Mitentdecker",
      joinTeam:
        "Werde Teil dieses Elite-Teams an Bord der Nebukadneza und hilf ihnen, ihre galaktische Mission zu vollenden.",
      travelingJoe: {
        name: "Traveling Joe",
        role: "Chefentdecker",
        description: "Kartiert unbekannte Territorien und entdeckt neue Bonuswelten in der Galaxie.",
      },
      motorChrisi: {
        name: "Motor Chrisi",
        role: "Chefingenieurin",
        description: "Hält die Nebukadneza mit ihrem legendären mechanischen Können am Laufen.",
      },
      shoppingLiz: {
        name: "Shopping Liz",
        role: "Navigationsoffizierin",
        description: "Findet den Kurs durch die Bonuswelten und die besten Deals im Universum.",
      },
      blockchainBob: {
        name: "Blockchain Bob",
        role: "Tech-Spezialist",
        description: "Verwaltet die digitalen Systeme des Schiffs und sichert alle Nequada-Transaktionen.",
      },
    },
    // Mission Section
    mission: {
      title: "Die Mission",
      sectionTitle: "Deine alltäglichen Aktionen,",
      sectionTitleHighlight: "Unser galaktischer Treibstoff",
      subtitle:
        "Die Bonus Galaxy verwandelt langweilige Bonusprogramme in ein immersives Abenteuer. Hilf mit, die Nebukadneza anzutreiben, indem du Transaktionen in Erlebnisse verwandelst.",
      collectNequada: "Nequada sammeln",
      collectNequadaDesc:
        "Verwandle alltägliche Einkäufe, Datennutzung und Energieverbrauch in wertvollen Raumschiff-Treibstoff.",
      redeemRewards: "Belohnungen einlösen",
      redeemRewardsDesc: "Tausche dein Nequada gegen echte Gutscheine, Produkte und exklusive digitale Assets ein.",
      winBig: "Groß gewinnen",
      winBigDesc: "Kämpfe um den ultimativen Preis: 30 Jahre 4-Sterne Hotelurlaub durch die Galaxie.",
      playEarn: "Spielen & Verdienen",
      playEarnDesc: "Klettere in den Bestenlisten, erfülle tägliche Challenges und schalte Story-Events frei.",
      stats: {
        weeklyViewers: "Wöchentliche Zuschauer",
        yearsOfPrizes: "Jahre an Preisen",
        partnerSectors: "Partner Sektoren",
        adventures: "Abenteuer",
      },
    },
    // Join Section
    join: {
      launch: "Start 2026",
      title: "Bereit für die",
      titleHighlight: "Expedition?",
      subtitle:
        "Sei unter den ersten Entdeckern an Bord der Nebukadneza. Melde dich für Early Access und exklusive Launch-Belohnungen an.",
      placeholder: "Deine E-Mail-Adresse",
      button: "Waitlist beitreten",
      success: "Willkommen an Bord, Entdecker!",
      successDesc: "Überprüfe deinen Posteingang für die Bestätigung.",
      trustIndicator: "Schließe dich 10.000+ zukünftigen Entdeckern an. Kein Spam, nur Launch-Updates.",
    },
    // Footer
    footer: {
      about: "Über uns",
      contact: "Kontakt",
      privacy: "Datenschutz",
      copyright: "© 2026 Bonus Galaxy. Alle Rechte vorbehalten.",
      tagline: "Next Level Loyalty • Powered by Adventure",
    },
    // Privacy Page
    privacy: {
      title: "Datenschutzerklärung",
      subtitle: "Gemäß DSGVO (EU) 2016/679",
      lastUpdated: "Stand: Dezember 2024",
      section1: {
        title: "1. Verantwortlicher",
        intro: "Verantwortlicher im Sinne des Art. 4 Z 7 DSGVO für die Verarbeitung Ihrer personenbezogenen Daten ist:",
        company: "Bonus Galaxy",
        name: "Klaus J. Kohlmayr",
        address1: "Mauerbach 2/5",
        address2: "5550 Radstadt",
        country: "Österreich",
        email: "office@bonus-galaxy.com",
      },
      section2: {
        title: "2. Grundsätze der Datenverarbeitung",
        content: "Wir verarbeiten Ihre personenbezogenen Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). In dieser Datenschutzerklärung informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unseres Bonus Galaxy Loyalty-Programms und Gutscheinsystems.",
      },
      section3: {
        title: "3. Welche Daten werden verarbeitet?",
        intro: "Im Rahmen des Bonus Galaxy Loyalty-Programms verarbeiten wir folgende Kategorien personenbezogener Daten:",
        masterData: {
          title: "3.1 Stammdaten",
          items: ["Vor- und Nachname", "E-Mail-Adresse", "Postanschrift (optional)", "Geburtsdatum (optional, für Geburtstagsangebote)", "Telefonnummer (optional)"],
        },
        transactionData: {
          title: "3.2 Transaktionsdaten",
          items: ["Kaufdatum und -uhrzeit", "Einkaufsstätte (Partnerunternehmen)", "Einkaufswert", "Gesammelte und eingelöste Bonuspunkte (Nequada)", "Eingelöste Gutscheine"],
        },
        technicalData: {
          title: "3.3 Technische Daten",
          items: ["IP-Adresse", "Browser-Typ und -Version", "Gerätetyp", "Zugriffszeitpunkt"],
        },
      },
      section4: {
        title: "4. Zweck und Rechtsgrundlage der Verarbeitung",
        contractFulfillment: {
          title: "4.1 Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)",
          items: ["Abwicklung der Mitgliedschaft im Loyalty-Programm", "Gutschrift und Verwaltung von Bonuspunkten (Nequada)", "Einlösung von Gutscheinen und Prämien", "Bereitstellung des Mitgliederkontos"],
        },
        legitimateInterest: {
          title: "4.2 Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO)",
          items: ["Verbesserung unserer Dienste", "Betrugsprävention", "Statistische Auswertungen in anonymisierter Form"],
        },
        consent: {
          title: "4.3 Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)",
          items: ["Versand von Newslettern und personalisierten Angeboten", "Profiling zur Erstellung individueller Empfehlungen", "Teilnahme an Gewinnspielen und Sonderaktionen"],
        },
      },
      section5: {
        title: "5. Weitergabe von Daten",
        intro: "Ihre Daten werden ausschließlich im Rahmen des Loyalty-Programms verarbeitet. Eine Weitergabe erfolgt nur:",
        items: ["An Partnerunternehmen des Bonus Galaxy Programms zur Einlösung von Gutscheinen und Sammlung von Punkten", "An IT-Dienstleister, die uns bei der technischen Abwicklung unterstützen (Auftragsverarbeiter gem. Art. 28 DSGVO)", "An Behörden, sofern wir gesetzlich dazu verpflichtet sind"],
        noSale: "Eine Weitergabe oder ein Verkauf Ihrer Daten an Dritte zu Werbezwecken erfolgt nicht.",
      },
      section6: {
        title: "6. Speicherdauer",
        intro: "Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die jeweiligen Zwecke erforderlich ist:",
        membership: "Mitgliedschaftsdaten:",
        membershipDuration: "Während der aktiven Mitgliedschaft und bis zu 3 Jahre nach Beendigung",
        transaction: "Transaktionsdaten:",
        transactionDuration: "7 Jahre gemäß handels- und steuerrechtlicher Aufbewahrungspflichten",
        newsletter: "Newsletter-Einwilligungen:",
        newsletterDuration: "Bis zum Widerruf",
        technical: "Technische Daten:",
        technicalDuration: "Maximal 12 Monate",
      },
      section7: {
        title: "7. Ihre Rechte als betroffene Person",
        intro: "Gemäß DSGVO haben Sie folgende Rechte:",
        rightToAccess: {
          title: "Auskunftsrecht (Art. 15 DSGVO)",
          description: "Sie können Auskunft über Ihre bei uns gespeicherten Daten verlangen.",
        },
        rightToRectification: {
          title: "Berichtigungsrecht (Art. 16 DSGVO)",
          description: "Sie können die Berichtigung unrichtiger Daten verlangen.",
        },
        rightToErasure: {
          title: "Löschungsrecht (Art. 17 DSGVO)",
          description: "Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
        },
        rightToRestriction: {
          title: "Einschränkung (Art. 18 DSGVO)",
          description: "Sie können die Einschränkung der Verarbeitung Ihrer Daten verlangen.",
        },
        rightToDataPortability: {
          title: "Datenübertragbarkeit (Art. 20 DSGVO)",
          description: "Sie können Ihre Daten in einem strukturierten Format erhalten.",
        },
        rightToObject: {
          title: "Widerspruchsrecht (Art. 21 DSGVO)",
          description: "Sie können der Verarbeitung Ihrer Daten widersprechen.",
        },
        rightToWithdraw: {
          title: "Widerrufsrecht bei Einwilligung",
          description: "Erteilte Einwilligungen können Sie jederzeit mit Wirkung für die Zukunft widerrufen, ohne dass die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung berührt wird.",
        },
      },
      section8: {
        title: "8. Beschwerderecht",
        intro: "Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren (Art. 77 DSGVO):",
        authority: "Österreichische Datenschutzbehörde",
        address1: "Barichgasse 40-42",
        address2: "1030 Wien",
        phone: "Telefon: +43 1 52 152-0",
        email: "dsb@dsb.gv.at",
        website: "www.dsb.gv.at",
      },
      section9: {
        title: "9. Cookies und Tracking",
        intro: "Unsere Website verwendet Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten:",
        necessary: {
          title: "Technisch notwendige Cookies:",
          description: "Diese sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.",
        },
        analytics: {
          title: "Analyse-Cookies:",
          description: "Helfen uns zu verstehen, wie Besucher unsere Website nutzen (nur mit Ihrer Einwilligung).",
        },
        marketing: {
          title: "Marketing-Cookies:",
          description: "Werden verwendet, um Ihnen relevante Werbung anzuzeigen (nur mit Ihrer Einwilligung).",
        },
        settings: "Sie können Ihre Cookie-Einstellungen jederzeit über unseren Cookie-Banner anpassen.",
      },
      section10: {
        title: "10. Datensicherheit",
        content: "Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder gegen den Zugriff unberechtigter Personen zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert. Die Datenübertragung erfolgt SSL/TLS-verschlüsselt.",
      },
      section11: {
        title: "11. Änderungen dieser Datenschutzerklärung",
        content: "Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.",
      },
      section12: {
        title: "12. Kontakt für Datenschutzanfragen",
        intro: "Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter:",
        department: "Bonus Galaxy - Datenschutz",
        name: "Klaus J. Kohlmayr",
        address1: "Mauerbach 2/5",
        address2: "5550 Radstadt",
        country: "Österreich",
        email: "office@bonus-galaxy.com",
      },
    },
    // Contact Page
    contact: {
      title: "Kontaktieren Sie uns",
      subtitle: "Haben Sie Fragen zum Bonus Galaxy Programm? Wir sind für Sie da und freuen uns auf Ihre Nachricht.",
      contactData: "Kontaktdaten",
      address: "Adresse",
      email: "E-Mail",
      sendMessage: "Nachricht senden",
      quote: "Die Sterne sind nicht das Ziel, sondern der Weg. Gemeinsam erobern wir die Bonus Galaxy.",
      form: {
        name: "Name",
        namePlaceholder: "Ihr Name",
        email: "E-Mail",
        emailPlaceholder: "ihre@email.com",
        subject: "Betreff",
        subjectPlaceholder: "Worum geht es?",
        message: "Nachricht",
        messagePlaceholder: "Ihre Nachricht an uns...",
        send: "Nachricht senden",
        sending: "Wird gesendet...",
        success: "Nachricht gesendet!",
        successDesc: "Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie möglich bei Ihnen melden.",
        error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
        privacyConsent: "Mit dem Absenden stimmen Sie unserer",
        privacyLink: "Datenschutzerklärung",
        privacyConsentEnd: "zu.",
      },
    },
    // About Page
    about: {
      originStory: "Die Entstehungsgeschichte",
      heroTitle: "Die Legende von",
      heroTitleHighlight: "Captain Klaus",
      heroSubtitle:
        "Eine Geschichte von kosmischen Abenteuern, einer unerwarteten Bruchlandung und der Suche nach der wertvollsten Ressource der Galaxie.",
      backHome: "Zurück zur Startseite",
      howItBegan: "Wie alles",
      howItBeganHighlight: "begann",
      chapters: {
        journey: {
          chapter: "Kapitel 1",
          title: "Die Reise beginnt",
          content:
            "Captain Klaus, ein legendärer Weltraumforscher, kommandierte das mächtige Raumschiff Nebukadneza auf einer Mission, um die unerforschten Regionen der Bonus Galaxy zu kartieren. Jahrzehntelang reiste er mit seiner Elite-Crew durch Nebel und an sterbenden Sternen vorbei, kartierte den Kosmos und sammelte seltene Schätze aus vergessenen Welten.",
        },
        crash: {
          chapter: "Kapitel 2",
          title: "Die Notlandung",
          content:
            "Während eines Routinesprungs durch den Hyperraum zwang ein katastrophaler Defekt im Nequada-Reaktor des Schiffs zu einer Notlandung auf einem unbekannten blauen Planeten - der Erde. Der Absturz war verheerend. Die Nebukadneza lag verkrüppelt in den Bergen, ihre Nequada-Reserven erschöpft und die Crew Millionen von Lichtjahren von zu Hause gestrandet.",
        },
        newMission: {
          chapter: "Kapitel 3",
          title: "Eine neue Mission",
          content:
            "Gestrandet auf der Erde, entdeckte Captain Klaus etwas Bemerkenswertes: Die Bewohner dieser Welt hatten ihre eigene Form des Energieaustauschs entwickelt - das Einkaufen. Und verborgen in diesem System war ein Weg, Nequada durch Bonuspunkte und Belohnungen zu erzeugen. Die Bonus Galaxy war geboren - ein Weg für die Menschen der Erde, der Crew zu helfen und dabei selbst unglaubliche Belohnungen zu verdienen.",
        },
      },
      crewStory: {
        title: "Die",
        titleHighlight: "gestrandete Crew",
        subtitle:
          "Triff die tapferen Crew-Mitglieder, die den Absturz überlebten und nun daran arbeiten, Nequada für die Heimreise zu sammeln.",
        travelingJoe:
          "Joe war der erste, der Kontakt zu den Händlern der Erde aufnahm. Seine Expertise im Navigieren fremder Marktplätze machte ihn unschätzbar wertvoll beim Aufbau der ersten Partnerschaften mit lokalen Einzelhändlern.",
        motorChrisi:
          "Chrisi arbeitet unermüdlich daran, die beschädigten Systeme der Nebukadneza zu reparieren. Jedes Stück gesammeltes Nequada bringt sie der Wiederherstellung der legendären Triebwerke des Schiffs näher.",
        shoppingLiz:
          "Liz entdeckte die Verbindung zwischen den Bonuspunkten der Erde und Nequada-Energie. Sie entwarf das Bonus Galaxy System, das Shopping-Belohnungen in Raumschiff-Treibstoff umwandelt.",
        blockchainBob:
          "Bob stellt sicher, dass jede Transaktion sicher ist und jeder Punkt verfolgt wird. Seine kryptografischen Systeme garantieren, dass kein Nequada bei der Übertragung verloren geht.",
      },
      nequada: {
        title: "Die Kraft von",
        titleHighlight: "Nequada",
        subtitle:
          "Nequada ist die seltenste Energiequelle im bekannten Universum. Sie treibt Raumschiffe an, öffnet Wurmlöcher und hält den Schlüssel zur Entdeckung des legendären Bonus Galaxy Schatzes - eines Tresors voller Belohnungen jenseits aller Vorstellungskraft.",
        shopEarn: "Einkaufen & Verdienen",
        shopEarnDesc: "Jeder Einkauf bei Partnerhändlern erzeugt Nequada-Energie für die Crew.",
        completeMissions: "Missionen erfüllen",
        completeMissionsDesc: "Spezielle Missionen bieten Bonus-Nequada und exklusive Belohnungen.",
        unlockTreasure: "Schatz freischalten",
        unlockTreasureDesc: "Sammle genug Nequada, um den Bonus Galaxy Schatztresor zu öffnen.",
        cta: "Wirst du Captain Klaus helfen, die Bonus Galaxy zu erobern?",
        joinExpedition: "Der Expedition beitreten",
      },
    },
  },
  en: {
    // Navbar
    nav: {
      home: "Homepage",
      story: "Story",
      contact: "Contact",
      privacy: "Privacy",
    },
    // Hero Section
    hero: {
      bigWin: "Big Win",
      yearsOf: "30 Years",
      hotelLuxury: "4-Star Hotel Luxury",
      coming: "Coming 2026",
      joinThe: "Join the",
      galacticExpedition: "Galactic Expedition",
      subtitle:
        "Captain Klaus and his crew aboard the Nebukadneza need your help. Transform everyday actions into intergalactic adventures.",
      missionCommander: "Mission Commander",
      ourStory: "Our Story",
    },
    // Crew Section
    crew: {
      title: "The Crew",
      subtitle: "Meet the heroes making this galactic mission possible",
      meetExplorers: "Meet Your Fellow Explorers",
      joinTeam: "Join this elite team aboard the Nebukadneza and help them complete their galactic mission.",
      travelingJoe: {
        name: "Traveling Joe",
        role: "Chief Explorer",
        description: "Maps uncharted territories and discovers new bonus worlds across the galaxy.",
      },
      motorChrisi: {
        name: "Motor Chrisi",
        role: "Chief Engineer",
        description: "Keeps the Nebukadneza running with her legendary mechanical expertise.",
      },
      shoppingLiz: {
        name: "Shopping Liz",
        role: "Navigation Officer",
        description: "Charts the course through bonus worlds and finds the best deals in the universe.",
      },
      blockchainBob: {
        name: "Blockchain Bob",
        role: "Tech Specialist",
        description: "Manages the ship's digital systems and secures all Nequada transactions.",
      },
    },
    // Mission Section
    mission: {
      title: "The Mission",
      sectionTitle: "Your Everyday Actions,",
      sectionTitleHighlight: "Our Galactic Fuel",
      subtitle:
        "The Bonus Galaxy transforms boring loyalty programs into an immersive adventure. Help power the Nebukadneza by turning transactions into experiences.",
      collectNequada: "Collect Nequada",
      collectNequadaDesc:
        "Transform everyday purchases, data usage, and energy consumption into valuable spaceship fuel.",
      redeemRewards: "Redeem Rewards",
      redeemRewardsDesc: "Exchange your Nequada for real vouchers, products, and exclusive digital assets.",
      winBig: "Win Big",
      winBigDesc: "Compete for the ultimate prize: 30 years of 4-star hotel vacations across the galaxy.",
      playEarn: "Play & Earn",
      playEarnDesc: "Climb the leaderboards, complete daily challenges, and unlock story events.",
      stats: {
        weeklyViewers: "Weekly Viewers",
        yearsOfPrizes: "Years of Prizes",
        partnerSectors: "Partner Sectors",
        adventures: "Adventures",
      },
    },
    // Join Section
    join: {
      launch: "Launch 2026",
      title: "Ready to Join the",
      titleHighlight: "Expedition?",
      subtitle:
        "Be among the first explorers to board the Nebukadneza. Sign up for early access and exclusive launch rewards.",
      placeholder: "Enter your email",
      button: "Join Waitlist",
      success: "Welcome aboard, explorer!",
      successDesc: "Check your inbox for confirmation.",
      trustIndicator: "Join 10,000+ future explorers. No spam, only launch updates.",
    },
    // Footer
    footer: {
      about: "About",
      contact: "Contact",
      privacy: "Privacy",
      copyright: "© 2026 Bonus Galaxy. All rights reserved.",
      tagline: "Next Level Loyalty • Powered by Adventure",
    },
    // Privacy Page
    privacy: {
      title: "Privacy Policy",
      subtitle: "According to GDPR (EU) 2016/679",
      lastUpdated: "Last updated: December 2024",
      section1: {
        title: "1. Data Controller",
        intro: "The data controller within the meaning of Art. 4 No. 7 GDPR for the processing of your personal data is:",
        company: "Bonus Galaxy",
        name: "Klaus J. Kohlmayr",
        address1: "Mauerbach 2/5",
        address2: "5550 Radstadt",
        country: "Austria",
        email: "office@bonus-galaxy.com",
      },
      section2: {
        title: "2. Principles of Data Processing",
        content: "We process your personal data exclusively on the basis of legal provisions (GDPR, TKG 2003). In this privacy policy, we inform you about the most important aspects of data processing within our Bonus Galaxy loyalty program and voucher system.",
      },
      section3: {
        title: "3. What Data is Processed?",
        intro: "As part of the Bonus Galaxy loyalty program, we process the following categories of personal data:",
        masterData: {
          title: "3.1 Master Data",
          items: ["First and last name", "Email address", "Postal address (optional)", "Date of birth (optional, for birthday offers)", "Phone number (optional)"],
        },
        transactionData: {
          title: "3.2 Transaction Data",
          items: ["Purchase date and time", "Store location (partner company)", "Purchase value", "Collected and redeemed bonus points (Nequada)", "Redeemed vouchers"],
        },
        technicalData: {
          title: "3.3 Technical Data",
          items: ["IP address", "Browser type and version", "Device type", "Access time"],
        },
      },
      section4: {
        title: "4. Purpose and Legal Basis of Processing",
        contractFulfillment: {
          title: "4.1 Contract Fulfillment (Art. 6 Para. 1 lit. b GDPR)",
          items: ["Processing of membership in the loyalty program", "Crediting and management of bonus points (Nequada)", "Redemption of vouchers and rewards", "Provision of member account"],
        },
        legitimateInterest: {
          title: "4.2 Legitimate Interest (Art. 6 Para. 1 lit. f GDPR)",
          items: ["Improvement of our services", "Fraud prevention", "Statistical evaluations in anonymized form"],
        },
        consent: {
          title: "4.3 Consent (Art. 6 Para. 1 lit. a GDPR)",
          items: ["Sending newsletters and personalized offers", "Profiling to create individual recommendations", "Participation in contests and special promotions"],
        },
      },
      section5: {
        title: "5. Data Sharing",
        intro: "Your data is processed exclusively within the loyalty program. Sharing only occurs:",
        items: ["With partner companies of the Bonus Galaxy program for voucher redemption and point collection", "With IT service providers who support us in technical processing (processors according to Art. 28 GDPR)", "With authorities if we are legally obligated to do so"],
        noSale: "Your data will not be shared or sold to third parties for advertising purposes.",
      },
      section6: {
        title: "6. Storage Duration",
        intro: "We store your personal data only as long as necessary for the respective purposes:",
        membership: "Membership data:",
        membershipDuration: "During active membership and up to 3 years after termination",
        transaction: "Transaction data:",
        transactionDuration: "7 years according to commercial and tax retention obligations",
        newsletter: "Newsletter consents:",
        newsletterDuration: "Until revocation",
        technical: "Technical data:",
        technicalDuration: "Maximum 12 months",
      },
      section7: {
        title: "7. Your Rights as a Data Subject",
        intro: "According to GDPR, you have the following rights:",
        rightToAccess: {
          title: "Right to Access (Art. 15 GDPR)",
          description: "You can request information about your data stored with us.",
        },
        rightToRectification: {
          title: "Right to Rectification (Art. 16 GDPR)",
          description: "You can request the correction of incorrect data.",
        },
        rightToErasure: {
          title: "Right to Erasure (Art. 17 GDPR)",
          description: "You can request the deletion of your data, provided there are no legal retention obligations.",
        },
        rightToRestriction: {
          title: "Right to Restriction (Art. 18 GDPR)",
          description: "You can request the restriction of processing of your data.",
        },
        rightToDataPortability: {
          title: "Right to Data Portability (Art. 20 GDPR)",
          description: "You can receive your data in a structured format.",
        },
        rightToObject: {
          title: "Right to Object (Art. 21 GDPR)",
          description: "You can object to the processing of your data.",
        },
        rightToWithdraw: {
          title: "Right to Withdraw Consent",
          description: "You can withdraw granted consents at any time with effect for the future, without affecting the lawfulness of processing based on consent before its withdrawal.",
        },
      },
      section8: {
        title: "8. Right to Complain",
        intro: "You have the right to lodge a complaint with the competent supervisory authority (Art. 77 GDPR):",
        authority: "Austrian Data Protection Authority",
        address1: "Barichgasse 40-42",
        address2: "1030 Vienna",
        phone: "Phone: +43 1 52 152-0",
        email: "dsb@dsb.gv.at",
        website: "www.dsb.gv.at",
      },
      section9: {
        title: "9. Cookies and Tracking",
        intro: "Our website uses cookies to provide you with the best possible user experience:",
        necessary: {
          title: "Technically necessary cookies:",
          description: "These are required for the operation of the website and cannot be deactivated.",
        },
        analytics: {
          title: "Analytics cookies:",
          description: "Help us understand how visitors use our website (only with your consent).",
        },
        marketing: {
          title: "Marketing cookies:",
          description: "Used to show you relevant advertising (only with your consent).",
        },
        settings: "You can adjust your cookie settings at any time via our cookie banner.",
      },
      section10: {
        title: "10. Data Security",
        content: "We employ technical and organizational security measures to protect your data against accidental or intentional manipulation, loss, destruction, or access by unauthorized persons. Our security measures are continuously improved in accordance with technological developments. Data transmission is SSL/TLS encrypted.",
      },
      section11: {
        title: "11. Changes to this Privacy Policy",
        content: "We reserve the right to adapt this privacy policy so that it always complies with current legal requirements or to implement changes to our services. The new privacy policy will then apply to your next visit.",
      },
      section12: {
        title: "12. Contact for Privacy Inquiries",
        intro: "If you have questions about data protection or wish to exercise your rights, please contact us at:",
        department: "Bonus Galaxy - Data Protection",
        name: "Klaus J. Kohlmayr",
        address1: "Mauerbach 2/5",
        address2: "5550 Radstadt",
        country: "Austria",
        email: "office@bonus-galaxy.com",
      },
    },
    // Contact Page
    contact: {
      title: "Contact Us",
      subtitle: "Have questions about the Bonus Galaxy program? We're here to help and look forward to your message.",
      contactData: "Contact Information",
      address: "Address",
      email: "Email",
      sendMessage: "Send Message",
      quote: "The stars are not the destination, but the path. Together we conquer the Bonus Galaxy.",
      form: {
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "your@email.com",
        subject: "Subject",
        subjectPlaceholder: "What is this about?",
        message: "Message",
        messagePlaceholder: "Your message to us...",
        send: "Send Message",
        sending: "Sending...",
        success: "Message sent!",
        successDesc: "Thank you for your message. We will get back to you as soon as possible.",
        error: "An error occurred. Please try again later.",
        privacyConsent: "By submitting, you agree to our",
        privacyLink: "Privacy Policy",
        privacyConsentEnd: ".",
      },
    },
    // About Page
    about: {
      originStory: "The Origin Story",
      heroTitle: "The Legend of",
      heroTitleHighlight: "Captain Klaus",
      heroSubtitle:
        "A tale of cosmic adventure, an unexpected crash landing, and the quest for the most valuable resource in the galaxy.",
      backHome: "Back to Home",
      howItBegan: "How It All",
      howItBeganHighlight: "Began",
      chapters: {
        journey: {
          chapter: "Chapter 1",
          title: "The Journey Begins",
          content:
            "Captain Klaus, a legendary space explorer, commanded the mighty starship Nebukadneza on a mission to chart the uncharted regions of the Bonus Galaxy. For decades, he and his elite crew traveled through nebulas and past dying stars, mapping the cosmos and collecting rare treasures from forgotten worlds.",
        },
        crash: {
          chapter: "Chapter 2",
          title: "The Emergency Landing",
          content:
            "During a routine jump through hyperspace, a catastrophic malfunction in the ship's Nequada reactor forced an emergency landing on an uncharted blue planet - Earth. The crash was devastating. The Nebukadneza lay crippled in the mountains, its Nequada reserves depleted and the crew stranded millions of light-years from home.",
        },
        newMission: {
          chapter: "Chapter 3",
          title: "A New Mission",
          content:
            "Stranded on Earth, Captain Klaus discovered something remarkable: the inhabitants of this world had developed their own form of energy exchange - shopping. And hidden within this system was a way to generate Nequada through bonus points and rewards. The Bonus Galaxy was born - a way for Earth's people to help the crew while earning incredible rewards themselves.",
        },
      },
      crewStory: {
        title: "The",
        titleHighlight: "Stranded Crew",
        subtitle:
          "Meet the brave crew members who survived the crash and now work to gather Nequada for the journey home.",
        travelingJoe:
          "Joe was the first to make contact with Earth's merchants. His expertise in navigating alien marketplaces made him invaluable in establishing the first partnerships with local retailers.",
        motorChrisi:
          "Chrisi works tirelessly to repair the Nebukadneza's damaged systems. Every piece of Nequada collected brings her closer to restoring the ship's legendary engines.",
        shoppingLiz:
          "Liz discovered the connection between Earth's bonus points and Nequada energy. She designed the Bonus Galaxy system that converts shopping rewards into starship fuel.",
        blockchainBob:
          "Bob ensures every transaction is secure and every point is tracked. His cryptographic systems guarantee that no Nequada is ever lost in the transfer.",
      },
      nequada: {
        title: "The Power of",
        titleHighlight: "Nequada",
        subtitle:
          "Nequada is the rarest energy source in the known universe. It powers starships, opens wormholes, and holds the key to unlocking the legendary Bonus Galaxy treasure - a vault of rewards beyond imagination.",
        shopEarn: "Shop & Earn",
        shopEarnDesc: "Every purchase at partner stores generates Nequada energy for the crew.",
        completeMissions: "Complete Missions",
        completeMissionsDesc: "Special missions offer bonus Nequada and exclusive rewards.",
        unlockTreasure: "Unlock Treasure",
        unlockTreasureDesc: "Accumulate enough Nequada to unlock the Bonus Galaxy treasure vault.",
        cta: "Will you help Captain Klaus conquer the Bonus Galaxy?",
        joinExpedition: "Join the Expedition",
      },
    },
  },
}

export type TranslationKeys = typeof translations.de
