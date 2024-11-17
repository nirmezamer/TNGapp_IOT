# TNGapp_IOT
הבעיה שאנחנו באים לפתור נוגעת להוצאות כלבים.
יש לנו 2 סוגי משתמשים:
1.	בעלי כלבים (Dog Owners) – אנשים שמעוניינים שמישהו יוציא את הכלב שלהם לטיול, וכן מעונינים להיות בבקרה על המיקום של הכלב בכל רגע נתון בטיול, דבר המאפשר להם לוודא שהטיול אכן קרה כנדרש, וכן שמי שמוציא את הכלב אינו מרמה
2.	מוציא כלבים (Dog Walkers) - אנשים שמעוניינים למצוא עבודות להוצאת כלבים, וכן מעוניינים לבצע את ההוצאה באופן האופטימלי

הרעיון המסדר שלנו הוא לייצר פלטפורמה המאפשרת סנכרון בין שני הקהלים: מוציאי הכלבים יוכלו למצוא עבודות ובמקביל בעלי הכלבים יקבלו תחושת בטחון בכל הנוגע לכך שהמשימה אכן בוצעה בהצלחה שלכלב לא נשקפה סכנה לאורך הטיול.

ה-MVP Flow כולל את התהליך המלא הבא:
1.	בעל הכלב מבצע אותנטיקציה מול השירות
2.	בעל הכלב מעלה בקשה להוצאת הכלב שלו
3.	מוציא כלבים מוצא את הבקשה ומשריין אותה
4.	לאחר שיחה ותיאום, בעל הכלב נותן למוציא הכלבים את הסיסמא לעבודה
5.	מוציא הכלבים מגיע ומאמת שהוא לוקח את הכלב על ידי שימוש בסיסמא
6.	מוציא הכלבים יוצא לטיול ובמקביל, בעל הכלב יכול לצפות במיקום של הכלב בכל רגע שירצה, ולהתעדכן אם יש חריגה מהמרחק המוגדר
7.	מוציא הכלבים מחזיר את הכלב ו"מנתק" את הקשר ביניהם


פיצ'רים שמימשנו:
1.	אותנטיקציה של כלל המשתמשים מול גוגל
2.	שימוש בToken-ים לטובת זיהוי המשתמש בכל פעולה (אין פעולות למשתמש לא מזוהה)
3.	מימוש מלא של האפליקציה ב-WEB ו-ANDROID עבור שני סוגי המשתמשים - גם Owner וגם Walker
4.	פיצ'ר שמאפשר לבעלי כלבים להעלות בקשה לטיול
5.	פיצ'ר שמאפשר לבעל הכלב לראות את כל העבודות שביקש
6.	פיצ'ר שמאפשר למוציאי כלבים לצפות בכלל העבודות שנמצאות כרגע בשוק
7.	פיצ'ר שמאפשר למוציא הכלבים "לתפוס" עבודה לעתיד
8.	פיצ'ר שמאפשר למוציא הכלבים להתחיל את העבודה ו"לקשור" את הכלב אל המיקום שלו 
9.	ווידוא שיח בין ה-Owner ל-Walker על ידי כך שכל תחילת עבודה מעוגנת בסיסמא שנקבעה על ידי ה-Owner
10.	פיצ'ר שמאפשר לבעלי כלבים לראות את מיקום הכלב שלהם ברגע נתון עבור עבודה ספציפית (ע"י המיקום של מוציא הכלבים)
11.	פיצ'ר שמאפשר לבעל הכלב לבדוק האם הכלב נלקח למרחק רחוק מהמרחק שהוגדר
12.	פיצ'ר שמאפשר למוציאי הכלבים לסיים טיול ו"לנתק" את הכלב מהמיקום הגאוגרפי שלו
   

רשימת Services בהם השתמשנו:
1.	AzureTables – לטובת ניהול מידע טבלאי כגון סטטוס כלל העבודות המונגשות באתר
2.	SignalR – לטובת העברת אינפורציה באופן מיידי בין משתמשים שונים
3.	AzureMaps – לטובת שימוש במפות
4.	OAuthLib – לטובת ביצוע אותנטיקציה מול גוגל
5.	Geopy - לטובת אכיפת מרחק חוקי בטיול

הנחות:
1. ההתחברות היא למיילים של גוגל של אוניברסיטת תל אביב בלבד
2. הנחנו (באופן די ברור) שמוציאי הכלבים הם בעלי מכשירי mobile מסוג ANDROID שיודעים לאסוף מיקום GPS ולשדר אותו וכן שאין מוציאי כלבים שמסתובבים עם לפטופים ומבצעים את הבקשות שלהם עם לפטופ.
הנחה זו נדרשת כיוון ששירותי המיקום מתבססים על היכולת של המכשיר לבצע בקשת GPS שאינה מתאפשרת בלפטופים

איך מפעילים:
1. עושים clone לכל התיקייה של הפרויקט
2. לאחר מכן נכנסים לתיקיית ה-frontend ומריצים npx expo start
3. לטובת הגרסה ל-WEB לוחצים w
4. לטובת הכרסה ל-ANDROID לוחצים a (בהנחה שיש Android Studio מותקן עם מכשיר ANDROID כלשהו שכבר הופעל)
5. מבצעים אותנטיקציה עם גוגל וזהו - אתם בפנים :)
