export interface CourseModule {
  number: number
  title: string
  duration: string
  topics: string[]
}

export interface CourseInstructor {
  name: string
  role: string
  image: string
  bio: string
  slug: string
}

export interface Course {
  id: number
  slug: string
  title: string
  subtitle: string
  category: string
  description: string
  fullDescription: string
  image: string
  duration: string
  lessonsCount: number
  level: "Başlanğıc" | "Orta" | "İrəli" | "Bütün səviyyələr"
  format: "Əyani və Onlayn" | "Əyani" | "Onlayn"
  language: string
  certificate: string
  price: string
  discountPrice?: string
  hasChildren: boolean
  children?: string[]
  tags: string[]
  whatYouWillLearn: string[]
  requirements: string[]
  targetAudience: string[]
  careerOpportunities: string[]
  syllabus: CourseModule[]
  instructor: CourseInstructor
  faq: {
    question: string
    answer: string
  }[]
}

export const coursesData: Course[] = [
  {
    id: 1,
    slug: "komputer",
    title: "Kompüter",
    subtitle: "Müasir rəqəmsal bacarıqlar, ofis proqramları və praktiki texnologiya tədrisi",
    category: "İT və Texnologiya",
    description: "Kompüter bilikləri və müasir rəqəmsal bacarıqlar üzrə hərtərəfli tədris proqramları.",
    fullDescription:
      "Kompüter kursumuz müasir dövrdə hər bir peşə sahibinə və fərdə lazım olan fundamental və praktik kompüter savadlılığını ən yüksək səviyyədə təmin edir. Dərslər tamamilə praktiki mühitdə, real tapşırıqlar və layihələr əsasında aparılır.",
    image: "/hero.jpeg",
    duration: "3 - 6 ay",
    lessonsCount: 48,
    level: "Bütün səviyyələr",
    format: "Əyani və Onlayn",
    language: "Azərbaycan dili",
    certificate: "Dövlət tərəfindən tanınan və beynəlxalq standartlara uyğun sertifikat",
    price: "120 AZN / ay",
    discountPrice: "99 AZN / ay",
    hasChildren: true,
    children: [
      "Kompüter operatoru",
      "Microsoft Office",
      "Qrafik dizayn",
    ],
    tags: ["Kompüter operatoru", "Excel", "Word", "PowerPoint", "Qrafik Dizayn", "Rəqəmsal Savadlılıq"],
    whatYouWillLearn: [
      "Kompüterin arxitekturası, əməliyyat sistemləri və fayl strukturu ilə peşəkar işləmə",
      "Microsoft Office paketi (Word, Excel, PowerPoint, Outlook) üzrə dərindən praktika",
      "Mürəkkəb Excel funksiyaları, düsturlar, diaqramlar və hesabatların hazırlanması",
      "Qrafik dizayn təməlləri, Photoshop və Illustrator ilə vizual materialların tərtibatı",
      "İnternet resursları, bulud xidmətləri (Google Drive, OneDrive) və rəqəmsal təhlükəsizlik qaydaları",
      "Sürətli və səhvsiz 10 barmaqla klaviatura yazma texnikası",
    ],
    requirements: [
      "Heç bir ilkin bilik və ya xüsusi texniki təcrübə tələb olunmur",
      "Öyrənməyə həvəs və dərslərdə nizam-intizam",
      "Ev tapşırıqlarını yerinə yetirmək üçün kompüter və ya noutbuk",
    ],
    targetAudience: [
      "Kompüter savadını sıfırdan öyrənmək istəyənlər",
      "Ofis meneceri, kadr mütəxəssisi və ya inzibati vəzifələrdə işləmək istəyənlər",
      "Mühasibat və maliyyə sahəsində Excel biliklərini artırmaq istəyən mütəxəssislər",
      "Tələbələr və dövlət qulluğuna hazırlaşan şəxslər",
    ],
    careerOpportunities: [
      "Kompüter operatoru və ofis meneceri",
      "Məlumat daxiletmə üzrə mütəxəssis (Data Entry)",
      "İnzibati köməkçi və katiblik",
      "Kiçik qrafik dizayner və vizual kontent tərtibatçısı",
    ],
    syllabus: [
      {
        number: 1,
        title: "Kompüter Əsasları və Windows Əməliyyat Sistemi",
        duration: "3 həftə",
        topics: [
          "Fərdi kompüterlərin quruluşu və iş prinsipləri",
          "Windows sistem konfiqurasiyası, idarəetmə paneli və fayl menecmenti",
          "Antivirus sistemləri, təhlükəsizlik və arxivləşdirmə proqramları",
        ],
      },
      {
        number: 2,
        title: "Microsoft Word ilə Peşəkar Sənəd Tərtibatı",
        duration: "3 həftə",
        topics: [
          "Mətnlərin formatlaşdırılması və rəsmi şablonların yaradılması",
          "Cədvəllər, qrafiklər və vizual elementlərlə iş",
          "Rəsmi məktublar, ərizələr, müqavilələr və avtomatlaşdırılmış məzmun hazırlığı",
        ],
      },
      {
        number: 3,
        title: "Microsoft Excel - Sadədən Mürəkkəbə Cədvəllər və Funksiyalar",
        duration: "4 həftə",
        topics: [
          "Riyazi, statistik və məntiqi funksiyalar (VLOOKUP, XLOOKUP, IF, SUMIFS)",
          "Pivot Table (Yekun cədvəllər), dinamik qrafiklər və vizuallaşdırma",
          "Şərti formatlaşdırma, məlumatların filtrlənməsi və hesabatların analizi",
        ],
      },
      {
        number: 4,
        title: "Microsoft PowerPoint və Təqdimat Sənəti",
        duration: "2 həftə",
        topics: [
          "Müasir slayd dizaynı prinsipləri və animasiya effektləri",
          "İnfoqrafika və interaktiv təqdimatların hazırlanması",
          "Çıxış üçün slaydların optimallaşdırılması",
        ],
      },
      {
        number: 5,
        title: "Qrafik Dizayn Əsasları (Photoshop & Illustrator)",
        duration: "4 həftə",
        topics: [
          "Rəng modelləri, kompozisiya və tipoqrafika",
          "Sosial media postlarının və bannerlərin dizaynı",
          "Şəkillərin retuş edilməsi və vektor qrafika layihələri",
        ],
      },
    ],
    instructor: {
      name: "Mehman Bayramov",
      role: "İT və Kompüter Təlimçisi",
      image: "/Mehman Bayramov.jpg",
      bio: "10 ildən çox tədris və İT təcrübəsinə malik baş mütəxəssis. Yüzlərlə məzunun əmək bazarına hazırlanmasında yaxından iştirak etmişdir.",
      slug: "mehman-bayramov",
    },
    faq: [
      {
        question: "Dərslər hansı günlər və saatlarda keçirilir?",
        answer: "Dərslər tələbələrin istəyinə uyğun olaraq həftədə 2 və ya 3 dəfə, səhər, günorta və axşam qruplarında təşkil edilir.",
      },
      {
        question: "Kursu bitirdikdən sonra sertifikat verilirmi?",
        answer: "Bəli, yekun imtahanı və praktiki layihəni müvəffəqiyyətlə başa vuran bütün məzunlara rəsmi sertifikat təqdim olunur.",
      },
      {
        question: "Dərsləri qaçırdıqda nə baş verir?",
        answer: "Qaçırılan dərslər üçün təlimçi tərəfindən əlavə konsultasiya saatı və dərs materialları təmin edilir.",
      },
    ],
  },
  {
    id: 2,
    slug: "tibb",
    title: "Tibb",
    subtitle: "Tibb bacısı işi, ilkin tibbi yardım və praktiki klinik biliklər",
    category: "Səhiyyə və Tibb",
    description: "Tibb sahəsində nəzəri və praktiki biliklərin yüksək standartlarla inkişaf etdirilməsi.",
    fullDescription:
      "Tibb təlim proqramımız ilkin tibbi yardımın təşkili, tibb bacısı vərdişlərinin aşılanması, pasiyentə qulluq qaydaları və təcili vəziyyətlərdə doğru qərar vermə qabiliyyətini formalaşdırmaq üçün hazırlanmışdır. Dərslər təcrübəli həkim və tibb mütəxəssisləri tərəfindən keçirilir.",
    image: "/hero.jpeg",
    duration: "4 - 8 ay",
    lessonsCount: 64,
    level: "Bütün səviyyələr",
    format: "Əyani",
    language: "Azərbaycan dili",
    certificate: "Peşəkar Tibbi Təlim Sertifikatı",
    price: "150 AZN / ay",
    discountPrice: "125 AZN / ay",
    hasChildren: true,
    children: [
      "Tibb bacısı",
      "İlkin tibbi yardım",
      "Tibbi biliklər",
    ],
    tags: ["Tibb bacısı", "İlkin Yardım", "Anatomiya", "Farmakologiya Əsasları", "Klinik Təcrübə"],
    whatYouWillLearn: [
      "İlkin tibbi yardımın tam qaydaları və təcili hallarda həyat xilasetmə manevrləri",
      "Əzələdaxili, dərialtı və venadaxili inyeksiyaların praktiki icrası (manekenlər üzərində)",
      "Sistemlərin qoşulması, qan təzyiqinin, nəbzin və bədən hərarətinin ölçülməsi",
      "Aseptika və antiseptika qaydaları, tibbi alətlərin sterilizasiyası",
      "Yaraların sarınması, fiksasiyası və qanaxmaların dayandırılması üsulları",
      "Əsas dərman preparatlarının istifadə təlimatları və farmakoloji anlayışlar",
    ],
    requirements: [
      "Tibb sahəsinə maraq və diqqətcillik",
      "Xüsusi ilkin tibbi təhsil tələb olunmur",
    ],
    targetAudience: [
      "Tibb bacısı və ya sanitar kimi fəaliyyət göstərmək istəyənlər",
      "Klinikalarda, estetik mərkəzlərdə və ya apteklərdə işləməyi hədəfləyənlər",
      "Gündəlik həyatda ailəsinə və yaxınlarına tibbi yardım göstərmək istəyən hər kəs",
    ],
    careerOpportunities: [
      "Özəl klinikalarda və laboratoriyalarda tibb bacısı / köməkçi",
      "Estetika və kosmetologiya mərkəzlərində tibbi assistent",
      "Məktəb və bağçalarda tibb məntəqəsi əməkdaşı",
      "Ev şəraitində pasiyentə qulluq və patronaj xidməti",
    ],
    syllabus: [
      {
        number: 1,
        title: "İnsan Anatomiyası və Fiziologiyasının Əsasları",
        duration: "4 həftə",
        topics: [
          "Bədən sistemləri (ürək-damar, tənəffüs, sinir, həzm)",
          "Həyati vacib göstəricilər və onların normativləri",
          "Sanitariya-gigiyena və yoluxucu xəstəliklərdən qorunma",
        ],
      },
      {
        number: 2,
        title: "Praktiki Tibb Bacısı Bacarıqları və Manipulyasiyalar",
        duration: "6 həftə",
        topics: [
          "İnyeksiya növləri: əzələdaxili, dərialtı və venadaxili tətbiq texnikası",
          "Kateterizasiya və sistemlərin qurulması qaydaları",
          "Dezinfeksiya və sterilizasiya standartları",
        ],
      },
      {
        number: 3,
        title: "Təcili və Təxirəsalınmaz İlkin Tibbi Yardım",
        duration: "4 həftə",
        topics: [
          "Ürək-ağciyər reanimasiyası (ÜAR) və süni tənəffüs",
          "Qanaxmalar, sınıqlar, yanıqlar və donmalarda yardım",
          "Zəhərlənmələr, anafilaktik şok və komatoz vəziyyətlərdə ilk addımlar",
        ],
      },
      {
        number: 4,
        title: "Pasiyentə Qulluq və Tibbi Etika",
        duration: "2 həftə",
        topics: [
          "Xəstələrə fərdi qulluq və psixoloji dəstək",
          "Dərman maddələrinin qəbul rejimi və qeydiyyatı",
          "Tibbi sənədləşmə və etik davranış qaydaları",
        ],
      },
    ],
    instructor: {
      name: "Gülnaz Cəfərova",
      role: "Tibb Mütəxəssisi və Təlimçi",
      image: "/Gülnaz Cəfərova.jpg",
      bio: "Uzun illər səhiyyə sistemində klinik təcrübə toplamış, tibb tədrisi üzrə yüzlərlə tələbə yetişdirmiş təcrübəli mütəxəssis.",
      slug: "gulnaz-ceferova",
    },
    faq: [
      {
        question: "Praktiki məşğələlər necə təşkil olunur?",
        answer: "Bütün inyeksiya və tibbi manipulyasiyalar müasir tibbi manekenlər və simulyasiya ləvazimatları üzərində real təcrübə ilə icra olunur.",
      },
      {
        question: "Klinikalarda təcrübə keçmək imkanı varmı?",
        answer: "Kursu uğurla bitirən fəal tələbələrə tərəfdaş tibb mərkəzlərində təcrübə proqramına qatılmaq dəstəyi verilir.",
      },
    ],
  },
  {
    id: 3,
    slug: "psixoloq-xidmeti",
    title: "Psixoloq xidməti",
    subtitle: "Fərdi inkişaf, emosional balans və peşəkar psixoloji dəstək xidmətləri",
    category: "Psixologiya və İnkişaf",
    description: "Fərdi inkişaf, stress idarəetməsi və psixoloji dəstək üçün peşəkar xidmət və təlimlər.",
    fullDescription:
      "Psixologiya xidmətimiz və tədris proqramımız fərdlərin daxili potensialını üzə çıxarmaq, həyatdakı emosional çətinlikləri aşmaq, stress və təşvişi idarə etmək üçün elmi əsaslı metodologiyalara söykənir. Dərslər və fərdi seanslar konfidensiallıq və yüksək peşəkarlıqla aparılır.",
    image: "/hero.jpeg",
    duration: "2 - 4 ay",
    lessonsCount: 32,
    level: "Bütün səviyyələr",
    format: "Əyani və Onlayn",
    language: "Azərbaycan dili",
    certificate: "Peşəkar Psixoloji Təlim Sertifikatı",
    price: "140 AZN / ay",
    discountPrice: "115 AZN / ay",
    hasChildren: false,
    tags: ["Psixologiya", "Konsultasiya", "Stress İdarəetməsi", "Emosional İntellekt", "Fərdi İnkişaf"],
    whatYouWillLearn: [
      "Emosional intellektin (EQ) inkişaf etdirilməsi və özünüdərk texnikaları",
      "Stress, təşviş, panik atak və depressiv vəziyyətlərin aradan qaldırılması metodları",
      "Effektiv ünsiyyət bacarıqları, münaqişələrin həlli və münasibətlərin tənzimlənməsi",
      "Uşaq və yeniyetmə psixologiyasının əsasları və valideyn-övlad münasibətləri",
      "Kognitiv-Davranış Terapiyası (CBT) və art-terapiyanın əsas prinsipləri",
      "Məqsədyönlülük, motivasiya və daxili resursların bərpası",
    ],
    requirements: [
      "Psixologiya və insan davranışına maraq",
      "Özünüinkişaf və empatiya bacarığını artırmaq istəyi",
    ],
    targetAudience: [
      "Psixologiya sahəsində nəzəri və praktiki biliklərini zənginləşdirmək istəyənlər",
      "Müəllimlər, tərbiyəçilər və valideynlər",
      "Daxili harmoniyasını tapmaq və stresslə mübarizə aparmaq istəyən hər kəs",
    ],
    careerOpportunities: [
      "Təhsil müəssisələrində və inkişaf mərkəzlərində psixoloq köməkçisi",
      "Kadrlar şöbəsində (HR) insan resursları və motivasiya üzrə mütəxəssis",
      "Fərdi kouçinq və inkişaf mentorluğu",
    ],
    syllabus: [
      {
        number: 1,
        title: "Ümumi və Sosial Psixologiyanın Əsasları",
        duration: "3 həftə",
        topics: [
          "Şəxsiyyət nəzəriyyələri və psixoloji xarakter tipləri",
          "İctimai münasibətlər və sosial təsirlərin psixologiyası",
          "Özünüqiymətləndirmə və daxili inamın formalaşması",
        ],
      },
      {
        number: 2,
        title: "Emosional İntellekt və Stress Menecmenti",
        duration: "3 həftə",
        topics: [
          "Emosiyaların tanınması, idarə edilməsi və ifadə yolları",
          "Xroniki stress, tükənmişlik sindromu və relaksasiya texnikaları",
          "Meditasiya, nəfəs məşqləri və zehnlilik (Mindfulness)",
        ],
      },
      {
        number: 3,
        title: "Yaş Psixologiyası və Ailə Münasibətləri",
        duration: "3 həftə",
        topics: [
          "Uşaqlıq və yeniyetməlik dövrünün psixoloji böhranları",
          "Ailədaxili ünsiyyət problemləri və effektiv dialoq modelləri",
          "Valideyn yanaşmaları və davranış korreksiyası",
        ],
      },
      {
        number: 4,
        title: "Praktiki Terapiya Metodları və Konsultasiya Əsasları",
        duration: "3 həftə",
        topics: [
          "Kognitiv-davranışçı yanaşmanın texnikaları",
          "Art-terapiya, nağıl terapiyası və proyeksiya metodları",
          "Psixoloji seansın etik kodeksi və fərdi yanaşma planı",
        ],
      },
    ],
    instructor: {
      name: "Könül Əsədova",
      role: "Praktik Psixoloq və Təlimçi",
      image: "/Könül Əsədova.jpg",
      bio: "Fərdi və ailə psixoterapiyası sahəsində ixtisaslaşmış, beynəlxalq təlimlərin iştirakçısı və təcrübəli psixoloq.",
      slug: "konul-esedova",
    },
    faq: [
      {
        question: "Fərdi seanslar üçün müraciət etmək mümkündürmü?",
        answer: "Bəli, təlim proqramı ilə yanaşı tam fərdi və məxfi psixoloji konsultasiya xidmətləri də göstərilir.",
      },
      {
        question: "Onlayn formatda iştirak effektivdirmi?",
        answer: "Bəli, interaktiv onlayn seanslarımız və dərslərimiz yüksək effektivliklə əyani format qədər nəticə verir.",
      },
    ],
  },
  {
    id: 4,
    slug: "loqoped-xidmeti",
    title: "Loqoped xidməti",
    subtitle: "Nitq qüsurlarının aradan qaldırılması, artikulyasiya və defektoloji dəstək",
    category: "Loqopediya və Defektologiya",
    description: "Nitq və danışıq problemlərinin aradan qaldırılması üçün loqoped xidməti və təlimləri.",
    fullDescription:
      "Loqopediya xidmətimiz uşaqlarda və böyüklərdə müşahidə olunan müxtəlif nitq qüsurlarını (kəkələmə, dislaliya, dizartriya, nitq ləngiməsi) müasir loqopedik masaj və xüsusi metodikalarla aradan qaldırır. Eyni zamanda loqoped və defektoloq kimi çalışmaq istəyənlər üçün peşəkar kurslar təklif edirik.",
    image: "/hero.jpeg",
    duration: "3 - 6 ay",
    lessonsCount: 48,
    level: "Bütün səviyyələr",
    format: "Əyani",
    language: "Azərbaycan dili",
    certificate: "Loqopediya və Defektologiya Sertifikatı",
    price: "160 AZN / ay",
    discountPrice: "135 AZN / ay",
    hasChildren: false,
    tags: ["Loqoped", "Nitq İnkişafı", "Artikulyasiya", "Loqopedik Masaj", "Defektologiya"],
    whatYouWillLearn: [
      "Səslərin düzgün qoyuluşu, avtomatlaşdırılması və nitqə tətbiqi qaydaları",
      "Artikulyasiya gimnastikası və loqopedik zondlarla masaj texnikaları",
      "Nitq ləngiməsi (ÜNL, FNL), dislaliya, dizartriya və kəkələmənin korreksiyası",
      "Uşağın nitq inkişaf səviyyəsinin diaqnostikası və fərdi inkişaf xəritəsinin tərtibi",
      "Fonematik eşitmənin və lüğət ehtiyatının zənginləşdirilməsi məşğələləri",
      "İnklüziv təhsil mühitində xüsusi qayğıya ehtiyacı olan uşaqlarla iş metodikası",
    ],
    requirements: [
      "Pedaqoji, psixoloji və ya tibbi baza arzuolunandır (amma məcburi deyil)",
      "Səbir, ünsiyyətsevərlik və uşaqlarla işləmək həvəsi",
    ],
    targetAudience: [
      "Loqoped-defektoloq kimi fəaliyyətə başlamaq istəyən mütəxəssislər",
      "Uşaq bağçalarının və məktəbəqədər müəssisələrin tərbiyəçiləri",
      "Övladının nitq inkişafına düzgün dəstək vermək istəyən valideynlər",
    ],
    careerOpportunities: [
      "İnkişaf mərkəzlərində və loqopedik kabinetlərdə mütəxəssis",
      "Özəl uşaq bağçalarında loqoped və korreksiyaçı müəllim",
      "Fərdi loqopedik seanslar və özəl praktik fəaliyyət",
    ],
    syllabus: [
      {
        number: 1,
        title: "Nitq Aparatının Anatomiyası və Loqopediyanın Nəzəri Əsasları",
        duration: "4 həftə",
        topics: [
          "Nitq orqanlarının quruluşu və fəaliyyəti",
          "Nitq pozuntularının təsnifatı və yaranma səbəbləri",
          "İlkin müayinə və loqopedik kartın doldurulması",
        ],
      },
      {
        number: 2,
        title: "Səslərin Korreksiyası və Artikulyasiya Təlimi",
        duration: "6 həftə",
        topics: [
          "Fit və fısıltı səslərinin (S, Z, Ç, Ş, J) qoyuluşu",
          "Sonor səslərin (R, L) formalaşdırılması üsulları",
          "Artikulyasiya gimnastikası və tənəffüs oyunları",
        ],
      },
      {
        number: 3,
        title: "Loqopedik Masaj və Zond Terapiyası",
        duration: "4 həftə",
        topics: [
          "Əl masajı və xüsusi loqopedik zondlarla iş qaydaları",
          "Əzələ tonusunun tənzimlənməsi (hipertonus və hipotonus)",
          "Ağız əzələlərinin stimullaşdırılması",
        ],
      },
      {
        number: 4,
        title: "Mürəkkəb Nitq Qüsurları və Müasir Korreksiya",
        duration: "4 həftə",
        topics: [
          "Kəkələmə zamanı ritmik və tənəffüs terapiyası",
          "Autizm və Daun sindromlu uşaqlarda nitq inkişafı",
          "Valideynlərlə birgə ev tapşırıqları sistemi",
        ],
      },
    ],
    instructor: {
      name: "Aynur Ələkbərova",
      role: "Loqoped-Defektoloq",
      image: "/Aynur Ələkbərova.jpg",
      bio: "Uşaq və böyüklərdə nitq qüsurlarının korreksiyası üzrə zəngin praktik təcrübəyə malik aparıcı loqoped.",
      slug: "aynur-elekberova",
    },
    faq: [
      {
        question: "Uşaqlarda hansı yaşdan etibarən loqopedə müraciət edilməlidir?",
        answer: "Uşaqda 2.5-3 yaşından etibarən nitq ləngiməsi və ya səsləri düzgün tələffüz etməmək müşahidə olunarsa, dərhal ilkin müayinə məsləhətdir.",
      },
      {
        question: "Böyüklər üçün kəkələmə və ya səs düzəlişi mümkündürmü?",
        answer: "Bəli, yetkin şəxslər üçün də xüsusi intensiv korreksiya proqramlarımız mövcuddur.",
      },
    ],
  },
  {
    id: 5,
    slug: "baytarliq",
    title: "Baytarlıq",
    subtitle: "Heyvan sağlamlığı, baytarlıq təbabəti və kliniki qulluq prinsipləri",
    category: "Heyvandarlıq və Baytarlıq",
    description: "Heyvan sağlamlığı, diaqnostika və baytarlıq sahəsində peşəkar təhsil proqramı.",
    fullDescription:
      "Baytarlıq kursumuz ev və təsərrüfat heyvanlarının sağlamlığının qorunması, xəstəliklərin ilkin diaqnostikası, peyvəndlənmə qaydaları, cərrahi və terapevtik yardımın əsaslarını əhatə edir. Kurs tələbələrə praktiki mühitdə nəzəriyyəni təcrübə ilə birləşdirmək şansı verir.",
    image: "/hero.jpeg",
    duration: "4 - 6 ay",
    lessonsCount: 48,
    level: "Bütün səviyyələr",
    format: "Əyani",
    language: "Azərbaycan dili",
    certificate: "Peşəkar Baytarlıq Assistentliyi Sertifikatı",
    price: "150 AZN / ay",
    discountPrice: "120 AZN / ay",
    hasChildren: false,
    tags: ["Baytarlıq", "Heyvan Sağlamlığı", "Vaksinasiya", "Zoologiya", "Klinik Qulluq"],
    whatYouWillLearn: [
      "Ev və təsərrüfat heyvanlarının anatomiyası, fiziologiyası və qidalanma rejimi",
      "Yoluxucu və daxili qeyri-yoluxucu xəstəliklərin əlamətləri və diaqnostikası",
      "Peyvənd təqvimi, vaksinlərin vurulması və profilaktik tədbirlər",
      "Yaraların təmizlənməsi, sarğı qoyulması və ilkin baytarlıq yardımı",
      "Baytarlıq aptekləri və dərman preparatlarının düzgün dozalanması",
      "Zoohigiyena və heyvanlara qulluq qaydaları",
    ],
    requirements: [
      "Heyvanlara sevgi və qayğıkeş münasibət",
      "İlkin xüsusi ixtisas tələb olunmur",
    ],
    targetAudience: [
      "Baytarlıq klinikalarında assistent və köməkçi işləmək istəyənlər",
      "Zoomağaza, sığınacaq və heyvandarlıq təsərrüfatlarının əməkdaşları",
      "Ev heyvanı sahibləri və fermerlər",
    ],
    careerOpportunities: [
      "Baytarlıq klinikalarında baytar assistenti / tibb işçisi",
      "Zoomağazalarda məsləhətçi və heyvan baxıcısı",
      "Heyvandarlıq komplekslərində və quşçuluq fabriklərində sanitar",
      "Özəl pet-otel və sığınacaqlarda baxıcı mütəxəssis",
    ],
    syllabus: [
      {
        number: 1,
        title: "Heyvan Anatomiyası və Fiziologiyası",
        duration: "4 həftə",
        topics: [
          "Ətyeyən və gövşəyən heyvanların daxili orqanları",
          "Heyvanlarda həyati göstəricilər: hərarət, nəbz, tənəffüs",
          "İmmun sistem və xəstəliklərə qarşı dözümlülük",
        ],
      },
      {
        number: 2,
        title: "İlkin Baytarlıq Yardımı və Manipulyasiyalar",
        duration: "5 həftə",
        topics: [
          "Heyvanların fiksasiyası və təhlükəsizlik qaydaları",
          "İnyeksiya növləri və dərmanların yeridilməsi",
          "Kəsilmə, travma və zəhərlənmələrdə təcili yardım",
        ],
      },
      {
        number: 3,
        title: "Vaksinasiya və Yoluxucu Xəstəliklər",
        duration: "4 həftə",
        topics: [
          "Virus və bakterial xəstəliklər (quduzluq, parvo, taun)",
          "Planlı peyvəndlərin icrası və pasportlaşdırma",
          "Parazitlərə qarşı (qurd və birə dərmanları) mübarizə",
        ],
      },
      {
        number: 4,
        title: "Zoohigiyena və Rasionun Təşkili",
        duration: "3 həftə",
        topics: [
          "Düzgün qidalanma və vitamin balansının təminatı",
          "Heyvan saxlama şəraiti və sanitar təmizlik",
          "Klinika sənədləşməsi və müştəri ünsiyyəti",
        ],
      },
    ],
    instructor: {
      name: "Fidan Məmmədli",
      role: "Baytar Həkim və Təlimçi",
      image: "/Fidan Məmmədli.jpg",
      bio: "Klinik baytarlıq təcrübəsinə malik, ev və təsərrüfat heyvanlarının müalicəsi üzrə peşəkar mütəxəssis.",
      slug: "fidan-memmedli",
    },
    faq: [
      {
        question: "Dərslərdə heyvanlar üzərində praktika keçirilirmi?",
        answer: "Bəli, tədris müddətində tərəfdaş baytarlıq klinikalarında real baxış və nəzarət altında praktiki məşğələlər təşkil olunur.",
      },
      {
        question: "Kursu bitirdikdən sonra iş tapmaqda kömək olunurmu?",
        answer: "Fəal məzunlarımızın CV-ləri tərəfdaş zoomağazalara və klinikalara təqdim edilir.",
      },
    ],
  },
  {
    id: 6,
    slug: "mektebeqeder-ve-ibtidai",
    title: "Məktəbəqədər və ibtidai",
    subtitle: "Uşaqların erkən inkişafı, məktəbə hazırlıq və müasir pedaqoji metodikalar",
    category: "Pedaqogika və Təhsil",
    description: "Məktəbəqədər və ibtidai təhsil üzrə uşaqların hərtərəfli inkişafına yönəlmiş peşəkar proqramlar.",
    fullDescription:
      "Bu proqram 3-7 yaşlı uşaqların intellektual, sosial və emosional inkişafını təmin etmək, onları məktəb həyatına uğurla hazırlamaq üçün müasir pedaqoji üsulları təqdim edir. Həmçinin bağça tərbiyəçisi və ibtidai sinif müəllimi kimi fəaliyyət göstərmək istəyən mütəxəssislər üçün kamil təlim bazasıdır.",
    image: "/hero.jpeg",
    duration: "3 - 6 ay",
    lessonsCount: 48,
    level: "Bütün səviyyələr",
    format: "Əyani və Onlayn",
    language: "Azərbaycan dili",
    certificate: "Məktəbəqədər Pedaqogika Sertifikatı",
    price: "130 AZN / ay",
    discountPrice: "105 AZN / ay",
    hasChildren: false,
    tags: ["Məktəbəqədər", "İbtidai Təhsil", "Montessori", "Məntiq", "Erkən İnkişaf"],
    whatYouWillLearn: [
      "Məktəbəqədər yaşlı uşaqlarda oxu, yazı və riyazi təfəkkürün formalaşdırılması",
      "Montessori, Reggio Emilia və oyun əsaslı tədris metodikaları",
      "Uşaqlarda diqqət, yaddaş və məntiqi düşüncəni artıran interaktiv oyunlar",
      "Dərs planının, gündəlik məşğələ cədvəlinin və inkişaf proqramlarının hazırlanması",
      "Hiperaktiv və diqqət əskikliyi olan uşaqlarla fərdi pedaqoji yanaşmalar",
      "Valideynlərlə pedaqoji əməkdaşlıq və hesabatlılıq sistemi",
    ],
    requirements: [
      "Pedaqogika və uşaq inkişafına sevgi və maraq",
      "Xüsusi ilkin pedaqoji diplom məcburi deyil",
    ],
    targetAudience: [
      "Məktəbəqədər hazırlıq müəllimləri və bağça tərbiyəçiləri",
      "Pedaqoji təhsil alan tələbələr və məzunlar",
      "Öz uşaqlarını məktəbə evdə düzgün hazırlamaq istəyən valideynlər",
    ],
    careerOpportunities: [
      "Özəl və dövlət uşaq bağçalarında tərbiyəçi",
      "Tədris və inkişaf mərkəzlərində məktəbəqədər hazırlıq müəllimi",
      "Dayə və fərdi pedaqoji repetitor",
    ],
    syllabus: [
      {
        number: 1,
        title: "Uşaq İnkişaf Mərhələləri və Müasir Pedaqogika",
        duration: "4 həftə",
        topics: [
          "Erkən uşaqlıq dövrünün psixofizioloji xüsusiyyətləri",
          "Müasir təlim nəzəriyyələri və alternativ metodikalar",
          "Məşğələ otağının təşkili və təhlükəsiz öyrənmə mühiti",
        ],
      },
      {
        number: 2,
        title: "Oxu, Yazı və Nitq İnkişafı Metodikası",
        duration: "5 həftə",
        topics: [
          "Hərflərin öyrədilməsi və hecalama metodları",
          "Xırda motorikanın inkişafı və düzgün qələm tutma vərdişi",
          "Söz ehtiyatının artırılması və şifahi nitqin formalaşması",
        ],
      },
      {
        number: 3,
        title: "Sadə Riyazi Təsəvvürlər və Məntiq",
        duration: "4 həftə",
        topics: [
          "Rəqəmlər, sayma, həndəsi fiqurlar və məkan anlayışları",
          "Müqayisə, qruplaşdırma və məntiqi düşünmə oyunları",
          "Praktiki materiallar və didaktik vəsaitlərlə iş",
        ],
      },
      {
        number: 4,
        title: "Əyləncəli Yaradıcılıq və Sosiallaşma",
        duration: "3 həftə",
        topics: [
          "Applikasiya, yapma, rəsm və musiqili hərəkətli oyunlar",
          "Qrup daxilində komanda ruhu və sosial davranış qaydaları",
          "Yekun sınaq dərsinin təşkili və qiymətləndirmə",
        ],
      },
    ],
    instructor: {
      name: "Səkinə Babayeva",
      role: "Məktəbəqədər Təhsil Mütəxəssisi",
      image: "/Səkinə Babayeva.jpg",
      bio: "Erkən inkişaf və məktəbəqədər təlim sahəsində geniş pedaqoji staja malik, müasir interaktiv tədris metodlarının müəllifi.",
      slug: "sekine-babayeva",
    },
    faq: [
      {
        question: "Təlim bitdikdə dərs materialları və vəsaitlər verilirmi?",
        answer: "Bəli, bütün tələbələrə elektron dərs planları, didaktik kartlar və hazır tədris vəsaitləri paketi təqdim olunur.",
      },
      {
        question: "Kursda praktiki sınaq dərsləri keçirilirmi?",
        answer: "Bəli, hər bir tələbə real qrup qarşısında sınaq dərsi apararaq müəllimdən rəy və tövsiyələr alır.",
      },
    ],
  },
  {
    id: 7,
    slug: "miq",
    title: "MİQ",
    subtitle: "Müəllimlərin İşə Qəbulu imtahanına hərtərəfli və zəmanətli hazırlıq proqramı",
    category: "İmtahana Hazırlıq",
    description: "Müəllimlərin işə qəbulu və sertifikasiya imtahanlarına yüksək ballı peşəkar hazırlıq.",
    fullDescription:
      "MİQ hazırlıq proqramımız Təhsil İnstitutunun ən son çərçivə sənədlərinə tam uyğun olaraq ixtisas, kurikulum (metodika və pedaqoji yanaşmalar) və məntiq istiqamətlərini əhatə edir. Yüzlərlə test tapşırığı, situativ sualların analizi və sınaq imtahanları ilə yüksək nəticə zəmanəti verilir.",
    image: "/hero.jpeg",
    duration: "4 - 8 ay",
    lessonsCount: 64,
    level: "Bütün səviyyələr",
    format: "Əyani və Onlayn",
    language: "Azərbaycan dili",
    certificate: "MİQ Hazırlıq Məzunu Sertifikatı",
    price: "140 AZN / ay",
    discountPrice: "110 AZN / ay",
    hasChildren: false,
    tags: ["MİQ", "Kurikulum", "Metodika", "Pedaqogika", "Dövlət İmtahanı"],
    whatYouWillLearn: [
      "Müasir Kurikulum nəzəriyyəsi, təhsil qanunvericiliyi və standartlar",
      "Təlim strategiyaları, üsulları (BİBÖ, Ziqzaq, Klaster və s.) və formaları",
      "Qiymətləndirmə növləri (Diaqnostik, Formativ, Summativ) və meyarların tərtibi",
      "Blum taksonomiyası, Qanye, Piaje, Vıqotski nəzəriyyələri və situativ suallar",
      "İmtahan tipli testlərin sürətli və dəqiq həlli texnikaları",
      "İxtisas fənni üzrə dərindən mövzu təhlilləri və aylıq sınaq imtahanları",
    ],
    requirements: [
      "Pedaqoji təhsil (ali və ya orta ixtisas) və ya sonuncu kurs tələbəsi olmaq",
      "Müntəzəm test həllinə və dərslərə hazır olmaq",
    ],
    targetAudience: [
      "Dövlət ümumtəhsil məktəblərinə müəllim kimi qəbul olmaq istəyən namizədlər",
      "Müəllimlərin sertifikasiya imtahanında yüksək bal toplamaq istəyən fəaliyyətdə olan müəllimlər",
      "Özəl məktəb və liseylərin qəbul testlərinə hazırlaşanlar",
    ],
    careerOpportunities: [
      "Dövlət orta məktəblərində rəsmi müəllimlik vəzifəsi",
      "Özəl lisey, gimnaziyalarda və kolleclərdə müəllim",
      "Repetitor mərkəzlərində fənn müəllimi",
    ],
    syllabus: [
      {
        number: 1,
        title: "Kurikulum Konsepsiyası və Hüquqi Baza",
        duration: "4 həftə",
        topics: [
          "Milli Kurikulumun prinsipləri və səriştələr",
          "Azərbaycan Respublikasının Təhsil Qanunu və dövlət standartları",
          "Fənn kurikulumunun strukturu və məzmun xətləri",
        ],
      },
      {
        number: 2,
        title: "Təlim Nəzəriyyələri və Psixoloji Yanaşmalar",
        duration: "5 həftə",
        topics: [
          "Jan Piaje, Lev Vıqotski və Hovard Qardner (Çoxnövlü zəka)",
          "Blumun idrak, emosional və psixomotor taksonomiyası",
          "Karl Dvek (Düşüncə tərzi) və Daniel Qoulman (EQ)",
        ],
      },
      {
        number: 3,
        title: "Təlim Metodikası, Strategiyalar və Qiymətləndirmə",
        duration: "5 həftə",
        topics: [
          "Müasir interaktiv təlim üsulları və fəal dərsin mərhələləri",
          "Məktəbdaxili qiymətləndirmə mexanizmləri və rubriklər",
          "Diferensial təlim və inklüziv sinif idarəetməsi",
        ],
      },
      {
        number: 4,
        title: "Situativ Test Bankı və Sınaq İmtahanları",
        duration: "4 həftə",
        topics: [
          "DİM və ARTİ nümunəvi situativ testlərinin təhlili",
          "Vaxtın idarə edilməsi və imtahan psixologiyası",
          "Canlı və onlayn MİQ sınaq sessiyaları",
        ],
      },
    ],
    instructor: {
      name: "Günay Məmmədova",
      role: "MİQ və Kurikulum Təlimçisi",
      image: "/Günay Məmmədova.jpg",
      bio: "MİQ və sertifikasiya hazırlığı üzrə ən yüksək nəticə göstərən müdavimlərin təlimçisi, metodist mütəxəssis.",
      slug: "gunay-memmedova",
    },
    faq: [
      {
        question: "Hazırlıq həm ixtisas, həm də kurikulumu əhatə edirmi?",
        answer: "Bəli, paket proqramımızda həm ixtisas dərsləri, həm metodika/kurikulum, həm də məntiq sualları tədris olunur.",
      },
      {
        question: "Sınaq imtahanları hansı tezliklə keçirilir?",
        answer: "Hər həftə sonu mövzu sınaqları, hər ayın sonunda isə real MİQ standartında böyük ümumi sınaq imtahanı keçirilir.",
      },
    ],
  },
]

export function getCourseBySlug(slug: string): Course | undefined {
  return coursesData.find((c) => c.slug === slug)
}

export function getAllCourseSlugs(): string[] {
  return coursesData.map((c) => c.slug)
}
