export interface PartnerEducation {
  degree: string
  institution: string
  year: string
}

export interface PartnerExperience {
  role: string
  organization: string
  period: string
  description: string
}

export interface Partner {
  id: number
  slug: string
  name: string
  position: string
  department: string
  specialty: string
  logo: string
  heroImage?: string
  experienceYears: number
  studentsCount: number
  coursesCount: number
  rating: number
  bio: string
  detailedAbout: string
  motto: string
  email: string
  phone: string
  linkedin?: string
  instagram?: string
  skills: string[]
  education: PartnerEducation[]
  experience: PartnerExperience[]
  certificates: string[]
  taughtCourses: {
    title: string
    slug: string
    description: string
  }[]
  consultationTopics: string[]
}

export const partnersData: Partner[] = [
  {
    id: 1,
    slug: "mehman-bayramov",
    name: "Mehman Bayramov",
    position: "Əməkdaş & Baş İT Təlimçisi",
    department: "Rəqəmsal Texnologiyalar və İT",
    specialty: "Kompüter savadlılığı, Ofis proqramları və Qrafik Dizayn",
    logo: "/Mehman Bayramov.jpg",
    experienceYears: 10,
    studentsCount: 650,
    coursesCount: 3,
    rating: 4.9,
    bio: "Rəqəmsal savadlılıq və kompüter elmləri üzrə 10 ildən artıq təcrübəyə malik aparıcı təlimçi.",
    detailedAbout:
      "Mehman Bayramov təhsil sahəsində uzun illər fəaliyyət göstərən, müasir kompüter proqramları, məlumatların idarə edilməsi və qrafik dizayn üzrə yüzlərlə tələbə və mütəxəssis yetişdirmiş peşəkar təlimçidir. Onun tədris metodikası sırf praktiki tapşırıqlar, real iş keysləri və interaktiv layihələr üzərində qurulub. Tələbələrin qısa müddətdə iş mühitinə adaptasiya olunmasına və rəqəmsal alətlərdən peşəkar istifadəsinə xüsusi önəm verir.",
    motto: "Texnologiyanı öyrənmək gələcəyə atılan ən möhkəm addımdır.",
    email: "mehman.bayramov@ugur.az",
    phone: "+994 50 000 00 00",
    linkedin: "https://linkedin.com",
    skills: [
      "Microsoft Excel (Advanced)",
      "Microsoft Office Paketi",
      "Kompüter Arxitekturası",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Məlumat Təhlili",
      "İnteraktiv Tədris Metodikası",
    ],
    education: [
      {
        degree: "Kompüter Mühəndisliyi (Bakalavr)",
        institution: "Azərbaycan Dövlət Neft və Sənaye Universiteti",
        year: "2010 - 2014",
      },
      {
        degree: "İnformasiya Texnologiyaları (Magistr)",
        institution: "Bakı Dövlət Universiteti",
        year: "2014 - 2016",
      },
    ],
    experience: [
      {
        role: "Baş İT Təlimçisi",
        organization: "Uğur Şəxsi İnkişaf Mərkəzi",
        period: "2020 - Hazırda",
        description: "Kompüter və rəqəmsal bacarıqlar üzrə kurikulumların tərtibi və tədrisin aparılması.",
      },
      {
        role: "İT Menecer və Təlim Mütəxəssisi",
        organization: "Digital Innovations MMC",
        period: "2016 - 2020",
        description: "Korporativ əməkdaşlar üçün rəqəmsal savadlılıq və ofis proqramları təlimlərinin təşkili.",
      },
    ],
    certificates: [
      "Microsoft Certified Trainer (MCT)",
      "Microsoft Office Specialist: Excel Expert",
      "Adobe Certified Professional in Visual Design",
    ],
    taughtCourses: [
      {
        title: "Kompüter və Rəqəmsal Savadlılıq",
        slug: "komputer",
        description: "Windows, Microsoft Office, fayl idarəetməsi və qrafik dizayn təməlləri.",
      },
    ],
    consultationTopics: [
      "Ofis işlərinin rəqəmsallaşdırılması və avtomatlaşdırılması",
      "Mürəkkəb cədvəllər və analitik Excel hesabatları",
      "Yeni başlayanlar üçün İT sahəsində karyera planlaması",
    ],
  },
  {
    id: 2,
    slug: "aynur-elekberova",
    name: "Aynur Ələkbərova",
    position: "Əməkdaş & Baş Loqoped-Defektoloq",
    department: "Nitq İnkişafı və Loqopediya",
    specialty: "Artikulyasiya korreksiyası, kəkələmə və loqopedik masaj",
    logo: "/Aynur Ələkbərova.jpg",
    experienceYears: 8,
    studentsCount: 480,
    coursesCount: 2,
    rating: 5.0,
    bio: "Uşaqlarda və yeniyetmələrdə nitq qüsurlarının müasir metodlarla aradan qaldırılması üzrə ixtisaslaşmış loqoped-defektoloq.",
    detailedAbout:
      "Aynur Ələkbərova müasir loqopediya və defektologiyanın ən son nailiyyətlərini tətbiq edərək, nitq qüsurlarından əziyyət çəkən yüzlərlə uşağa aydın və səlis danışıq qazandırmış mütəxəssisdir. Həmçinin gənc loqopedlər üçün praktik ixtisasartırma dərsləri və ustad dərsləri keçir.",
    motto: "Aydın nitq gözəl gələcəyin qapısını açır.",
    email: "aynur.elekberova@ugur.az",
    phone: "+994 50 000 00 00",
    instagram: "https://instagram.com",
    skills: [
      "Loqopedik Masaj və Zond Terapiyası",
      "Artikulyasiya Gimnastikası",
      "Kəkələmənin Korreksiyası",
      "Dislaliya və Dizartriya Müalicəsi",
      "İnklüziv Pedaqogika",
      "Uşaq Psixo-Loqopediyası",
    ],
    education: [
      {
        degree: "Korreksiyaedici Təlim və Defektologiya (Bakalavr)",
        institution: "Azərbaycan Dövlət Pedaqoji Universiteti",
        year: "2012 - 2016",
      },
      {
        degree: "Xüsusi Pedaqogika (Magistr)",
        institution: "ADPU",
        year: "2016 - 2018",
      },
    ],
    experience: [
      {
        role: "Aparıcı Loqoped-Defektoloq",
        organization: "Uğur Şəxsi İnkişaf Mərkəzi",
        period: "2019 - Hazırda",
        description: "Fərdi və qrup seanslarının aparılması, loqopediya kurslarının tədrisi.",
      },
      {
        role: "Loqoped",
        organization: "Uşaq İnkişaf Mərkəzi",
        period: "2016 - 2019",
        description: "Erkən yaşlı uşaqlarda nitq diaqnostikası və korreksiyası.",
      },
    ],
    certificates: [
      "Beynəlxalq Loqopedik Zond Masajı Sertifikatı",
      "Uşaqlarda Kəkələmənin Neyro-korreksiyası Diploması",
    ],
    taughtCourses: [
      {
        title: "Loqoped xidməti və təlimləri",
        slug: "loqoped-xidmeti",
        description: "Nitq pozuntularının aradan qaldırılması və peşəkar loqopediya vərdişləri.",
      },
    ],
    consultationTopics: [
      "Uşaqlarda nitq ləngiməsinin ilkin diaqnostikası",
      "Səslərin düzgün tələffüzü üçün ev şəraitində məşğələlər",
      "Kəkələmə zamanı valideyn davranış modelləri",
    ],
  },
  {
    id: 3,
    slug: "konul-esedova",
    name: "Könül Əsədova",
    position: "Əməkdaş & Praktik Psixoloq",
    department: "Psixoloji Dəstək və Fərdi İnkişaf",
    specialty: "Kognitiv-davranışçı terapiya, ailə psixologiyası və stress menecmenti",
    logo: "/Könül Əsədova.jpg",
    experienceYears: 9,
    studentsCount: 520,
    coursesCount: 2,
    rating: 4.9,
    bio: "Fərdi inkişaf, emosional rifah və münasibətlərin korreksiyası üzrə zəngin təcrübəyə malik praktik psixoloq.",
    detailedAbout:
      "Könül Əsədova fərdlərin emosional böhranları aradan qaldırması, özünəinamın artırılması, təşviş və stressin idarə olunması istiqamətində uğurlu seanslar və təlimlər həyata keçirir. İnsan psixologiyasına həssas və elmi əsaslı yanaşması ilə tanınır.",
    motto: "Özünü tanımaq həyatın ən böyük qələbəsidir.",
    email: "konul.esedova@ugur.az",
    phone: "+994 50 000 00 00",
    linkedin: "https://linkedin.com",
    skills: [
      "Kognitiv Davranış Terapiyası (CBT)",
      "Art-Terapiya və Layihələndirmə",
      "Stress və Təşviş İdarəetməsi",
      "Ailə və Münasibət Konsultasiyası",
      "Yeniyetmə Psixologiyası",
      "Mindfulness və Relaksasiya",
    ],
    education: [
      {
        degree: "Psixologiya (Bakalavr)",
        institution: "Bakı Dövlət Universiteti",
        year: "2011 - 2015",
      },
      {
        degree: "Klinik Psixologiya (Magistr)",
        institution: "BDU",
        year: "2015 - 2017",
      },
    ],
    experience: [
      {
        role: "Baş Psixoloq və Təlimçi",
        organization: "Uğur Şəxsi İnkişaf Mərkəzi",
        period: "2019 - Hazırda",
        description: "Fərdi seanslar, qrup treninqləri və psixologiya kurslarının rəhbəri.",
      },
      {
        role: "Məsləhətçi Psixoloq",
        organization: "Psixoloji Dəstək Mərkəzi",
        period: "2015 - 2019",
        description: "Ailə və fərdlərə psixoloji konsultasiyaların təşkili.",
      },
    ],
    certificates: [
      "Cognitive Behavioral Therapy (CBT) Practitioner",
      "Art-Therapy Specialist Certificate",
      "Family Systems Therapy Program",
    ],
    taughtCourses: [
      {
        title: "Psixoloq xidməti və təlimləri",
        slug: "psixoloq-xidmeti",
        description: "Emosional balans, stress idarəetməsi və psixoloji dəstək metodları.",
      },
    ],
    consultationTopics: [
      "Təşviş, qorxu və panik vəziyyətlərin korreksiyası",
      "Özünəinam və daxili motivasiyanın gücləndirilməsi",
      "Ailədaxili dialoq və münasibətlərin bərpası",
    ],
  },
  {
    id: 4,
    slug: "gulnaz-ceferova",
    name: "Gülnaz Cəfərova",
    position: "Əməkdaş & Tibb Təlimçisi",
    department: "Tibb və Səhiyyə Proqramları",
    specialty: "İlkin tibbi yardım, tibb bacısı işi və klinik təcrübə",
    logo: "/Gülnaz Cəfərova.jpg",
    experienceYears: 12,
    studentsCount: 780,
    coursesCount: 3,
    rating: 5.0,
    bio: "Səhiyyə sahəsində 12 illik klinik və pedaqoji təcrübəyə malik təcrübəli tibb mütəxəssisi.",
    detailedAbout:
      "Gülnaz Cəfərova təcili tibbi yardım, cərrahi və terapevtik tibb bacılığı sahəsində dərin klinik təcrübəyə sahibdir. Kurs müddətində tələbələrə bütün manipulyasiyaları təhlükəsiz və peşəkar şəkildə icra etməyi, eləcə də kritik anlarda dərhal doğru qərar verməyi öyrədir.",
    motto: "Həyat xilas etmək doğru bilik və cəsarətdən başlayır.",
    email: "gulnaz.ceferova@ugur.az",
    phone: "+994 50 000 00 00",
    skills: [
      "İlkin Təcili Tibbi Yardım (BLS/CPR)",
      "İnyeksiya və Venoz Girişlər",
      "Aseptika və Sterilizasiya",
      "Klinik Diaqnostika Əsasları",
      "Pasiyentə Qulluq və Monitorinq",
      "Farmakologiya Təməlləri",
    ],
    education: [
      {
        degree: "Müalicə İşi",
        institution: "Azərbaycan Tibb Universiteti",
        year: "2007 - 2013",
      },
    ],
    experience: [
      {
        role: "Tibb Proqramları Rəhbəri",
        organization: "Uğur Şəxsi İnkişaf Mərkəzi",
        period: "2018 - Hazırda",
        description: "Tibb bacısı və ilkin yardım tədris proqramlarının hazırlanması və rəhbərliyi.",
      },
      {
        role: "Baş Tibb Mütəxəssisi",
        organization: "Mərkəzi Klinik Xəstəxana",
        period: "2013 - 2018",
        description: "Təcili yardım və reanimasiya şöbəsində klinik fəaliyyət.",
      },
    ],
    certificates: [
      "Basic Life Support (BLS) Certified Instructor",
      "Advanced Trauma Care Certificate",
    ],
    taughtCourses: [
      {
        title: "Tibb və İlkin Tibbi Yardım",
        slug: "tibb",
        description: "Tibb bacısı vərdişləri, inyeksiyalar, sistemlər və xilasetmə qaydaları.",
      },
    ],
    consultationTopics: [
      "Məişət və fövqəladə hallarda ilkin yardım qaydaları",
      "Xəstəxanaöncəsi yardımın təşkili",
      "Tibb sahəsində peşəkar standartlar və karyera",
    ],
  },
  {
    id: 5,
    slug: "sekine-babayeva",
    name: "Səkinə Babayeva",
    position: "Əməkdaş & Məktəbəqədər Təhsil Metodisti",
    department: "Məktəbəqədər və İbtidai Təhsil",
    specialty: "Erkən inkişaf metodikaları, məktəbə hazırlıq və didaktik oyunlar",
    logo: "/Səkinə Babayeva.jpg",
    experienceYears: 11,
    studentsCount: 600,
    coursesCount: 2,
    rating: 4.9,
    bio: "Uşaqların erkən intellektual inkişafı və məktəbəqədər pedaqogika üzrə aparıcı ekspert.",
    detailedAbout:
      "Səkinə Babayeva uşaqların maraq və potensialını nəzərə alaraq, öyrənmə prosesini əyləncəli və effektiv edən qabaqcıl metodikalar tətbiq edir. Yüzlərlə tərbiyəçi və müəllimin peşəkar inkişafına mentorluq etmişdir.",
    motto: "Uşağın dünyasına sevgi ilə toxunan təhsil əsl möcüzə yaradır.",
    email: "sekine.babayeva@ugur.az",
    phone: "+994 50 000 00 00",
    skills: [
      "Montessori Metodikası",
      "Məktəbəqədər Təlim Kurikulumu",
      "Məntiq və İntellekt Oyunları",
      "Oxu və Yazı Təməlləri",
      "Uşaq Pedaqoji Diaqnostikası",
      "Didaktik Material Tərtibatı",
    ],
    education: [
      {
        degree: "Məktəbəqədər Təhsil Pedaqogikası (Bakalavr)",
        institution: "Azərbaycan Dövlət Pedaqoji Universiteti",
        year: "2009 - 2013",
      },
      {
        degree: "Təhsilin İdarə Edilməsi (Magistr)",
        institution: "ADPU",
        year: "2013 - 2015",
      },
    ],
    experience: [
      {
        role: "Pedaqoji Proqramlar Rəhbəri",
        organization: "Uğur Şəxsi İnkişaf Mərkəzi",
        period: "2019 - Hazırda",
        description: "Məktəbəqədər hazırlıq və pedaqoji kursların metodiki rəhbərliyi.",
      },
      {
        role: "Baş Metodist-Tərbiyəçi",
        organization: "Müasir Təhsil Kompleksi",
        period: "2014 - 2019",
        description: "Erkən inkişaf qruplarında dərslərin təşkili və monitorinqi.",
      },
    ],
    certificates: [
      "Montessori Early Childhood Education Certificate",
      "Didaktik Oyunlar və İnteraktiv Tədris Diplomı",
    ],
    taughtCourses: [
      {
        title: "Məktəbəqədər və ibtidai təhsil",
        slug: "mektebeqeder-ve-ibtidai",
        description: "Uşaqların məktəbə hazırlığı, montessori metodları və pedaqogika.",
      },
    ],
    consultationTopics: [
      "Uşağın məktəbə psixoloji və intellektual hazırlığı",
      "Hiperaktiv uşaqlarla evdə öyrənmə metodları",
      "Valideynlər üçün didaktik oyun seçimləri",
    ],
  },
  {
    id: 6,
    slug: "fidan-memmedli",
    name: "Fidan Məmmədli",
    position: "Əməkdaş & Baytar Həkim",
    department: "Baytarlıq və Zoologiya",
    specialty: "Heyvan sağlamlığı, cərrahi yardım və vaksinasiya",
    logo: "/Fidan Məmmədli.jpg",
    experienceYears: 7,
    studentsCount: 340,
    coursesCount: 1,
    rating: 4.8,
    bio: "Ev və təsərrüfat heyvanlarının sağlamlığı, müalicəsi və profilaktikası üzrə təcrübəli baytar həkim.",
    detailedAbout:
      "Fidan Məmmədli heyvansevərlər və gələcəyin baytarları üçün təcrübəyə əsaslanan dolğun təlim kursları həyata keçirir. Dərslərdə həm nəzəri anatomiya, həm də heyvanlara düzgün qayğı və ilkin tibbi yardım sirlərini aşılayır.",
    motto: "Dilsiz dostlarımızın sağlamlığı bizim ən böyük məsuliyyətimizdir.",
    email: "fidan.memmedli@ugur.az",
    phone: "+994 50 000 00 00",
    skills: [
      "Baytarlıq Terapiyası",
      "Vaksinasiya və İmmunlaşdırma",
      "Zoohigiyena və Rasion Tərtibi",
      "Təcili Baytarlıq Yardımı",
      "Dəri və Daxili Xəstəliklər",
      "Klinik Laborator Təhlillər",
    ],
    education: [
      {
        degree: "Baytarlıq Təbabəti (Bakalavr)",
        institution: "Azərbaycan Dövlət Aqrar Universiteti",
        year: "2013 - 2018",
      },
    ],
    experience: [
      {
        role: "Aparıcı Baytar Mütəxəssis və Təlimçi",
        organization: "Uğur Şəxsi İnkişaf Mərkəzi",
        period: "2021 - Hazırda",
        description: "Baytarlıq kurslarının tədrisi və klinik təcrübələrin koordinasiyası.",
      },
      {
        role: "Baytar Həkim",
        organization: "VetLife Baytarlıq Klinikası",
        period: "2018 - 2021",
        description: "Ev heyvanlarının müayinəsi, cərrahiyyəsi və vaksinasiyası.",
      },
    ],
    certificates: [
      "Small Animal Internal Medicine Certificate",
      "Veterinary Emergency & Critical Care",
    ],
    taughtCourses: [
      {
        title: "Baytarlıq Təlim Proqramı",
        slug: "baytarliq",
        description: "Heyvan sağlamlığı, diaqnostika və ilkin baytarlıq yardımı.",
      },
    ],
    consultationTopics: [
      "Ev heyvanlarında düzgün peyvənd və qurd profilaktikası",
      "Heyvanların mövsümi xəstəliklərdən qorunması",
      "Baytarlıq klinikalarında iş prinsipləri",
    ],
  },
  {
    id: 7,
    slug: "gunay-memmedova",
    name: "Günay Məmmədova",
    position: "Əməkdaş & MİQ / Kurikulum Təlimçisi",
    department: "Pedaqoji İmtahanlara Hazırlıq",
    specialty: "Kurikulum, metodika, pedaqoji nəzəriyyələr və MİQ hazırlığı",
    logo: "/Günay Məmmədova.jpg",
    experienceYears: 10,
    studentsCount: 890,
    coursesCount: 2,
    rating: 5.0,
    bio: "Müəllimlərin işə qəbulu və sertifikasiya imtahanlarında ən yüksək nəticələr göstərən müdavimlərin təlimçisi.",
    detailedAbout:
      "Günay Məmmədova təhsil islahatları, fəal təlim metodları və qiymətləndirmə meyarları üzrə zəngin təcrübəyə malik baş mütəxəssisdir. Hazırladığı müdavimlərin 95%-dən çoxu MİQ və Sertifikasiya imtahanlarında uğur qazanaraq məktəblərə təyinat almışdır.",
    motto: "Müəllim öyrətməkdən yorulmayanda millət inkişaf edir.",
    email: "gunay.memmedova@ugur.az",
    phone: "+994 50 000 00 00",
    linkedin: "https://linkedin.com",
    skills: [
      "Milli Kurikulum Standartları",
      "Təlim Nəzəriyyələri və Psixologiyası",
      "Məktəbdaxili Qiymətləndirmə",
      "Situativ Testlərin Təhlili",
      "Diferensial və İnklüziv Təlim",
      "Təhsil Hüququ və Qanunvericilik",
    ],
    education: [
      {
        degree: "Pedaqogika və Metodika (Bakalavr)",
        institution: "Bakı Dövlət Universiteti",
        year: "2010 - 2014",
      },
      {
        degree: "Təhsildə Qiymətləndirmə və Monitorinq (Magistr)",
        institution: "ADPU",
        year: "2014 - 2016",
      },
    ],
    experience: [
      {
        role: "MİQ və Kurikulum Təlimləri Rəhbəri",
        organization: "Uğur Şəxsi İnkişaf Mərkəzi",
        period: "2018 - Hazırda",
        description: "Müəllim namizədlər üçün intensiv təlim proqramlarının aparılması.",
      },
      {
        role: "Təhsil Metodisti",
        organization: "Təhsil İnkişaf Mərkəzi",
        period: "2015 - 2018",
        description: "Fənn kurikulumlarının təhlili və müəllimlər üçün metodik vəsaitlərin hazırlanması.",
      },
    ],
    certificates: [
      "Beynəlxalq Təlimçi Sertifikatı (ToT)",
      "Müasir Təlim Texnologiyaları Eksperti",
    ],
    taughtCourses: [
      {
        title: "MİQ və Sertifikasiya Hazırlığı",
        slug: "miq",
        description: "Kurikulum, metodika, pedaqoji testlər və sınaq imtahanları.",
      },
    ],
    consultationTopics: [
      "MİQ imtahanı üçün fərdi hazırlıq planının tərtibi",
      "Situativ testlərdə düzgün cavab tapma strategiyaları",
      "Sertifikasiya mərhələsində müəllimlər üçün məsləhətlər",
    ],
  },
]

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partnersData.find((p) => p.slug === slug)
}

export function getAllPartnerSlugs(): string[] {
  return partnersData.map((p) => p.slug)
}
