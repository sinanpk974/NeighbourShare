import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import Footer from "../components/Footer";
import { Search } from "lucide-react";

function Items() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);

  const titleFromUrl = searchParams.get("title") || "";
  const categoryFromUrl = searchParams.get("category") || "";

  const [search, setSearch] = useState(titleFromUrl);

  // ==============================
  // PAGINATION
  // ==============================
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedItems = items.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    setSearch(titleFromUrl);
  }, [titleFromUrl]);

  // Reset pagination whenever search/category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFromUrl]);

  // Prevent page from going beyond available pages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (categoryFromUrl) {
      if (categoryFromUrl.toLowerCase() === "others") {
        axios
          .get("http://https://neighbourshare-i2wq.onrender.com/api/getItems")
          .then((res) => {
            const excludedCategories = [
              "tools",
              "electronics",
              "kitchen",
              "outdoor",
            ];

            const filteredItems = res.data.filter(
              (item) =>
                !excludedCategories.includes(
                  item.category?.trim().toLowerCase()
                )
            );

            setItems(filteredItems);
          })
          .catch((error) => {
            console.log(
              "Error fetching other items:",
              error
            );

            setItems([]);
          });

        return;
      }

      axios
        .get("http://https://neighbourshare-i2wq.onrender.com/api/search", {
          params: {
            category: categoryFromUrl,
          },
        })
        .then((res) => {
          console.log(
            "Category results:",
            res.data
          );

          setItems(res.data.items);
        })
        .catch((error) => {
          console.log(
            "Error filtering category:",
            error
          );

          setItems([]);
        });

      return;
    }

    if (search.trim()) {
      const timer = setTimeout(() => {
        axios
          .get("http://https://neighbourshare-i2wq.onrender.com/api/search", {
            params: {
              title: search.trim(),
            },
          })
          .then((res) => {
            console.log(
              "Search results:",
              res.data
            );

            setItems(res.data.items);
          })
          .catch((error) => {
            console.log(
              "Error searching items:",
              error
            );

            setItems([]);
          });
      }, 400);

      return () => clearTimeout(timer);
    }

    axios
      .get("http://https://neighbourshare-i2wq.onrender.com/api/getItems")
      .then((res) => {
        setItems(res.data);
      })
      .catch((error) => {
        console.log(
          "Error fetching items:",
          error
        );

        setItems([]);
      });
  }, [search, categoryFromUrl]);

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    if (value.trim()) {
      setSearchParams({
        title: value.trim(),
      });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ==============================
          HEADER
      ============================== */}

      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <p className="text-sm font-semibold text-primary">
            COMMUNITY ITEMS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-text sm:text-4xl">
            Browse all items
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Discover items shared by people in your community.
          </p>

        </div>
      </section>

      {/* ==============================
          SEARCH
      ============================== */}

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="relative">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={handleSearch}
              className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

          </div>

        </div>
      </section>

      {/* ==============================
          ITEMS
      ============================== */}

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ==============================
              TITLE
          ============================== */}

          <div className="mb-6">

            <h2 className="text-xl font-bold text-text">
              {categoryFromUrl
                ? `${categoryFromUrl} items`
                : search
                ? `Search results for "${search}"`
                : "All items"}
            </h2>

            <p className="mt-1 text-sm text-muted">
              {items.length} item
              {items.length !== 1 ? "s" : ""}
            </p>

          </div>

          {/* ==============================
              ITEM GRID
          ============================== */}

          {items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 px-3 sm:grid-cols-2 sm:gap-6 sm:px-0 lg:grid-cols-3 xl:grid-cols-4">

                {paginatedItems.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                  />
                ))}

              </div>

              {/* ==============================
                  PAGINATION
              ============================== */}

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => prev - 1)
                    }
                    disabled={currentPage === 1}
                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white">
                    {currentPage}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => prev + 1)
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    More
                  </button>

                </div>
              )}

            </>
          ) : (

            /* ==============================
               NO ITEMS
            ============================== */

            <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">

              <h3 className="text-lg font-bold text-text">
                No items found
              </h3>

              <p className="mt-2 text-sm text-muted">
                Try searching for another item or category.
              </p>

            </div>

          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Items;