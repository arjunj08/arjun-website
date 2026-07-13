export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "mentor1",
    quote: "Arjun's execution speed is remarkable. He turned a complex 90-screen UI spec into a functional Flutter build in record time at Veixon. Outstanding startup engineer.",
    author: "Veixon Mentor",
    role: "Senior Engineering lead @ Veixon"
  },
  {
    id: "founder1",
    quote: "Arjun brings a rare combination of competitive programming algorithmic rigor and a clean creative frontend sense. Highly recommended product builder.",
    author: "Startup Founder",
    role: "Founder @ Veixon"
  }
];
