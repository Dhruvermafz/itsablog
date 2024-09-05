import Error404 from "../pages/Error404";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
export const publicRoutes = [
  { path: "/", element: Home },
  { path: "*", element: Error404 },
  { path: "/contact", element: Contact },
];

export const adminRoutes = [
  //   { path: "/admin", element: AdminWrapper },
  //   { path: "/admin/tours", element: TourList },
  //   { path: "/admin/comments-reviews", element: ReviewsCard },
  //   { path: "/admin/tours/create", element: AddTourPackage },
  //   { path: "/admin/tours/update", element: UpdateTour },
  //   { path: "/admin/bookings", element: Bookings },
  //   { path: "/admin/queries", element: Queries },
  //   { path: "/admin/blogs", element: BlogPage },
  //   { path: "/admin/blog/create", element: BlogCreate },
  //   { path: "/admin/reviews", element: CommentsReviews },
  //   { path: "/admin/users", element: UsersTable },
  //   { path: "/admin/extras", element: CategoriesTags },
];
