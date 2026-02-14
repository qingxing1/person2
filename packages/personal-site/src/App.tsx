import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';
import { useSearch } from '@/hooks/useSearch';

// 页面组件
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Algorithms from "@/pages/Algorithms";
import AlgorithmDetail from "@/pages/AlgorithmDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import SearchResults from "@/pages/SearchResults";
import NotFound from "@/pages/NotFound";

// 布局组件
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { results } = useSearch(searchQuery);
  const navigate = useNavigate();

  const logout = () => {
    setIsAuthenticated(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && results.length > 0) {
      navigate('/search', { state: { results, query } });
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* 导航栏 */}
        <Navbar onSearch={handleSearch} />
        
        {/* 主内容区 */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/algorithms/:id" element={<AlgorithmDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* 页脚 */}
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}
