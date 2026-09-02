export interface GalleryItem {
  id: number
  src: string
  alt: string
  title: string
  category: "Dərslər" | "Mərasimlər" | "Seminarlar" | "Komanda" | "Hadisələr" | "Mentorluq"
  date: string
  featured?: boolean
}

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/gallery_outdoor.jpg",
    alt: "Akademiya tələbə qrupu",
    title: "Açılış Günü 2024",
    category: "Hadisələr",
    date: "Sentyabr 2024",
    featured: true,
  },
  {
    id: 2,
    src: "/gallery_classroom.jpg",
    alt: "Sinif dərsi mühiti",
    title: "İnkişaf Proqramı Dərsləri",
    category: "Dərslər",
    date: "Oktyabr 2024",
    featured: true,
  },
  {
    id: 3,
    src: "/gallery_ceremony.jpg",
    alt: "Məzuniyyət mərasimi",
    title: "Sertifikat Mərasimi 2024",
    category: "Mərasimlər",
    date: "İyun 2024",
    featured: true,
  },
  {
    id: 4,
    src: "/gallery_seminar.jpg",
    alt: "Biznes seminarı",
    title: "Liderlik və İnnovasiya Seminarı",
    category: "Seminarlar",
    date: "Avqust 2024",
  },
  {
    id: 5,
    src: "/gallery_teamwork.jpg",
    alt: "Komanda işi",
    title: "Layihə Üzərində Komanda İşi",
    category: "Komanda",
    date: "Noyabr 2024",
  },
  {
    id: 6,
    src: "/gallery_mentoring.jpg",
    alt: "Fərdi mentorluq",
    title: "Fərdi İnkişaf Sessiyası",
    category: "Mentorluq",
    date: "Dekabr 2024",
  },
]

export const galleryCategories = [
  "Hamısı",
  "Dərslər",
  "Mərasimlər",
  "Seminarlar",
  "Komanda",
  "Hadisələr",
  "Mentorluq",
] as const

export type GalleryCategory = (typeof galleryCategories)[number]
