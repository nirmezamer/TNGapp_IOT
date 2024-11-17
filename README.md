# TNGapp_IOT
הבעיה שאנחנו באים לפתור נוגעת להוצאות כלבים.
יש לנו 2 סוגי משתמשים:
1.	בעלי כלבים (Dog Owners) – רוצים שמישהו יוציא את הכלב שלהם לטיול, וכן רוצים להיות מסוגלים לפקח על המיקום של הכלב בכל רגע נתון בטיול. זה מאפשר להם לוודא שהטיול אכן קרה כנדרש, וכן שמי שמוציא את הכלב אינו מרמה
2.	מוציא כלבים (Dog Walkers) - רוצים למצוא עבודות להוצאת כלבים וכן רוצים לבצע את ההוצאה באופן האופטימלי
הרעיון המסדר שלנו הוא לייצר פלטפורמה המאפשרת למוציאי הכלבים למצוא עבודות ובמקביל מאפשרת לבעלי הכלבים תחושת בטחון בכל הנוגע לכך שהמשימה אכן בוצעה בהצלחה וכן שלכלב לא נשקפה סכנה לאורך הטיול.

ה-MVP Flow כולל את התהליך המלא הבא:
1.	בעל הכלב מבצע אותנטיקציה מול השירות
2.	בעל הכלב מעלה בקשה להוצאת הכלב שלו
3.	מוציא כלבים מוצא את הבקשה ומשריין אותה
4.	לאחר שיחה ותיאום, בעל הכלב נותן למוציא הכלבים את הסיסמא לעבודה
5.	מוציא הכלבים מגיע ומאמת שהוא לוקח את הכלב על ידי שימוש בסיסמא
6.	מוציא הכלבים יוצא לטיול ובמקביל, בעל הכלב יכול לראות את המיקום של הכלב בכל רגע שירצה, וכן האם יש חריגה מהמרחק המותר
7.	מוציא הכלבים מחזיר את הכלב ו"מנתק" את הקשר ביניהם


פיצ'רים שמימשנו:
1.	אותנטיקציה של כלל המשתמשים מול גוגל
2.	שימוש בToken-ים לטובת זיהוי המשתמש בכל פעולה (אין פעולות למשתמש לא מזוהה)
3.	מימוש מלא של האפליקציה בווב ובאנדרויד עבור שני סוגי המשתמשים - גם Owner וגם Walker
4.	פיצ'ר שמאפשר לבעלי כלבים להעלות בקשה לטיול
5.	פיצ'ר שמאפשר לבעל הכלב לראות את כל העבודות שביקש
6.	פיצ'ר שמאפשר למוציאי כלבים לצפות בכלל העבודות שנמצאות כרגע בשוק
7.	פיצ'ר שמאפשר למוציא הכלבים "לתפוס" עבודה לעתיד
8.	פיצ'ר שמאפשר למוציא הכלבים להתחיל את העבודה ו"לקשור" את הכלב אל המיקום שלו 
9.	ווידוא שיח בין ה-Owner ל-Walker על ידי כך שכל תחילת עבודה מעוגנת בסיסמא שנקבעה על ידי ה-Owner
10.	פיצ'ר שמאפשר לבעלי כלבים לראות את מיקום הכלב שלהם ברגע נתון עבור עבודה ספציפית (ע"י המיקום של מוציא הכלבים)
11.	פיצ'ר שמאפשר לבעל הכלב לבדוק האם הוא נלקח למרחק רחוק מדי, כלומר המוציא מטייל רחוק מדי עם הכלב
12.	פיצ'ר שמאפשר למוציאי הכלבים לסיים טיול ו"לנתק" את הכלב מהמיקום הגאוגרפי שלו
   

רשימת Services בהם השתמשנו:
1.	AzureTables – לטובת ניהול מידע טבלאי כגון סטטוס כלל העבודות המונגשות באתר
2.	SignalR – לטובת העברת אינפורציה באופן מיידי בין משתמשים שונים
3.	AzureMaps – לטובת שימוש במפות
4.	OAuthLib – לטובת ביצוע אותנטיקציה מול גוגל
5.	Geopy - לטובת אכיפת מרחק חוקי בטיול

הנחות:
הנחנו (באופן די ברור) שמוציאי הכלבים הם בעלי מכשירי mobile מסוג אנדרויד שיודעים לאסוף מיקום GPS ולשדר אותו וכן שאין מוציאי כלבים שמסתובבים עם לפטופים ומבצעים את הבקשות שלהם עם לפטופ.
הנחה זו נדרשת כיוון ששירותי המיקום מתבססים על היכולת של המכשיר לבצע איכון GPS מה שלא מתאפשר בלפטופים
