import AccordionQnA from "@/components/AccordionQnA";
import BannerSection from "@/components/BannerSection";
// import CourseHighlights from '@/components/CourseHighlights';
// import InstructorInfo from '@/components/InstructorInfo';
import CustomerReviews from '@/components/CustomerReviews';
import FAQSection from '@/components/FAQSection';
// import CallToAction from '@/components/CallToAction';

export const metadata = {
  title: 'পূর্ণাঙ্গ রোবোটিক্স ও AI কোর্স - Robotics Academy',
  description: '৬ মাসে শূন্য থেকে রোবোটিক্স মাস্টার করুন, প্র্যাকটিকাল প্রোজেক্ট সহ।',
};

export default function CourseDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSection />
      {/* <CourseHighlights />
      <InstructorInfo /> */}
      {/* <CustomerReviews /> */}
      {/* <FAQSection /> */}
      <AccordionQnA />
      {/* <CallToAction /> */}
    </div>
  );
}
