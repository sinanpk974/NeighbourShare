import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Search,
  Share2,
  Users,
  Package,
  Handshake,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";

import communityImage from "../assets/community-sharing.png";
import ItemCard from "../components/ItemCard";
import Footer from "../components/Footer";

function Home() {

  const [items, setItems] = useState([]);
  const [homeSearch, setHomeSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3003/api/getItems")
      .then((res) => {
        console.log(res.data);
        setItems(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleShareItem = () => { const token = localStorage.getItem("token"); if (!token) { navigate("/login"); return; } navigate("/myItems"); };

  const handleHomeSearch = () => {
    if (homeSearch.trim()) {
      navigate(
        `/items?title=${encodeURIComponent(homeSearch.trim())}`
      );
    }
  };

  const handleCategory = (category) => {

    if (category === "All Items") {
      navigate("/items");
      return;
    }

    navigate(
      `/items?category=${encodeURIComponent(category)}`
    );
  };

  return (
    <main className="min-h-screen bg-background">

      {}
      <section className="relative overflow-hidden bg-background">

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">

          {}
          <div className="max-w-2xl">

            {}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <ShieldCheck size={17} />
              Trusted community sharing
            </div>

            {}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">
              Share what you have.
              <span className="block text-primary">
                Borrow what you need.
              </span>
            </h1>

            {}
            <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
              NeighbourShare connects people in your local community so you
              can share useful items, borrow what you need, and build stronger
              neighbourhood connections.
            </p>

            {}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() => navigate("/items")}
                className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md"
              >
                Find an Item

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button type="button" onClick={handleShareItem} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3.5 font-semibold text-text transition hover:border-primary/30 hover:bg-primary/5" > <Share2 size={18} className="text-primary" /> Share an Item </button>

            </div>

            {}
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted">

              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={17}
                  className="text-success"
                />
                Verified users
              </div>

              <div className="flex items-center gap-2">
                <Users
                  size={17}
                  className="text-primary"
                />
                Local community
              </div>

              <div className="flex items-center gap-2">
                <Handshake
                  size={17}
                  className="text-accent"
                />
                Easy sharing
              </div>

            </div>

          </div>


          {}
          <div className="relative mx-auto w-full max-w-[40rem] lg:ml-auto">

            {}
            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-accent/20 blur-3xl sm:-right-8 sm:-top-8 sm:h-32 sm:w-32 lg:-right-10 lg:-top-10 lg:h-40 lg:w-40" />

            <div className="absolute -bottom-5 -left-5 h-28 w-28 rounded-full bg-primary/20 blur-3xl sm:-bottom-8 sm:-left-8 sm:h-36 sm:w-36 lg:-bottom-10 lg:-left-10 lg:h-48 lg:w-48" />

            {}
            <div className="relative overflow-hidden rounded-2xl bg-primary p-2 shadow-xl sm:rounded-[1.5rem] sm:p-3 lg:rounded-[2rem] lg:p-4">

              <div className="overflow-hidden rounded-xl bg-background sm:rounded-[1.25rem] lg:rounded-[1.5rem]">

                <img
                  src={communityImage}
                  alt="Neighbours sharing items with each other"
                  className="block aspect-[2/1] w-full object-cover"
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {}
      <section className="border-y border-border bg-white">

        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

          <div className="mb-4 text-center">

            <h2 className="text-2xl font-bold text-text">
              What do you need?
            </h2>

            <p className="mt-1 text-sm text-muted">
              Find items shared by people in your community.
            </p>

          </div>


          {}
          <div className="relative">

            <Search
              size={21}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="text"
              placeholder="Search by item title or category..."
              value={homeSearch}
              onChange={(e) => setHomeSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleHomeSearch();
                }
              }}
              className="h-14 w-full rounded-2xl border border-border bg-background pl-12 pr-28 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            <button
              type="button"
              onClick={handleHomeSearch}
              className="absolute right-2 top-2 h-10 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Search
            </button>

          </div>

        </div>

      </section>
      

      {}
      <section className="bg-background">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-semibold text-primary">
                EXPLORE
              </p>

              <h2 className="mt-1 text-2xl font-bold text-text sm:text-3xl">
                Browse by category
              </h2>

            </div>

          </div>


          {}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            {[
              "All Items",
              "Tools",
              "Electronics",
              "Kitchen",
              "Outdoor",
              "Others",
            ].map((category, index) => (

              <button
                key={category}
                type="button"
                onClick={() => handleCategory(category)}
                className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
                  index === 0
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-white text-text hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                {category}
              </button>

            ))}

          </div>

        </div>

      </section>


      {}
      <section className="bg-background pb-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-sm font-semibold text-primary">
                NEAR YOUR COMMUNITY
              </p>

              <h2 className="mt-1 text-2xl font-bold text-text sm:text-3xl">
                Available items
              </h2>

            </div>

            <button
              type="button"
              onClick={() => navigate("/items")}
              className="hidden items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-dark sm:flex"
            >
              View all
              <ArrowRight size={16} />
            </button>

          </div>


          <div className="mt-7 grid grid-cols-1 gap-5 px-3 sm:grid-cols-2 sm:gap-6 sm:px-0 lg:grid-cols-3 xl:grid-cols-4">

            {items
              .filter((item) => item.availability === "Available")
              .slice(0, 8)
              .map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                />
              ))}

          </div>

        </div>

      </section>

       {}

<section className="bg-white border-y border-border">

  <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

    <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">

      {}

      <div>

        <Users
          className="mx-auto mb-3 text-accent"
          size={28}
        />

        <p className="text-3xl font-bold text-primary">
          Local
        </p>

        <p className="mt-1 text-sm text-muted">
          Trusted community
        </p>

      </div>


      {}

      <div>

        <Package
          className="mx-auto mb-3 text-accent"
          size={28}
        />

        <p className="text-3xl font-bold text-primary">
          Shared
        </p>

        <p className="mt-1 text-sm text-muted">
          Useful items
        </p>

      </div>


      {}

      <div>

        <Handshake
          className="mx-auto mb-3 text-accent"
          size={28}
        />

        <p className="text-3xl font-bold text-primary">
          Simple
        </p>

        <p className="mt-1 text-sm text-muted">
          Borrowing process
        </p>

      </div>


      {}

      <div>

        <ShieldCheck
          className="mx-auto mb-3 text-accent"
          size={28}
        />

        <p className="text-3xl font-bold text-primary">
          Verified
        </p>

        <p className="mt-1 text-sm text-muted">
          Community members
        </p>

      </div>

    </div>

  </div>

</section>
      
      
            {}
      <Footer />

    </main>
  );
}

export default Home;