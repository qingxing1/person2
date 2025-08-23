import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { sendMessage } from "@/services/message";

// 联系表单组件
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "姓名不能为空";
    }

    if (!formData.email.trim()) {
      newErrors.email = "邮箱不能为空";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "请输入有效的邮箱地址";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "主题不能为空";
    }

    if (!formData.content.trim()) {
      newErrors.content = "消息内容不能为空";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 清除对应字段的错误
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await sendMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        content: formData.content,
        address: window.location.origin // 添加来源地址
      });

      if (response.code === 200) {
        toast.success("消息发送成功！我会尽快回复您。");
        // 重置表单
        setFormData({
          name: "",
          email: "",
          subject: "",
          content: "",
        });
      } else {
        toast.error(response.msg || "发送失败，请稍后重试");
      }
    } catch (error: any) {
      toast.error(error.message || "网络错误，请稍后重试");
      console.error("发送消息失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={cn(
              "w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              errors.name
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            )}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            邮箱 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={cn(
              "w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              errors.email
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            )}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          主题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={cn(
            "w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            errors.subject
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          )}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          消息内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          rows={5}
          value={formData.content}
          onChange={handleChange}
          className={cn(
            "w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            errors.content
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          )}
          disabled={isSubmitting}
        ></textarea>
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              发送中...
            </>
          ) : (
            <>
              发送消息
              <i className="fa-solid fa-paper-plane ml-2"></i>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">联系我</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          有任何问题或合作意向？请随时通过以下方式联系我，我会尽快回复您。
        </p>
        <div className="h-1 w-20 bg-blue-600 dark:bg-blue-400 rounded-full mt-6"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 联系表单 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6">发送消息</h2>
          <ContactForm />
        </div>

        {/* 联系信息 */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6">联系方式</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    邮箱
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    <a
                      href="mailto:contact@example.com"
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      contact@example.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                  <i className="fa-brands fa-weixin"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    微信
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    example_wechat
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <i className="fa-brands fa-github"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    GitHub
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    <a
                      href="https://github.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      github.com/example
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <i className="fa-brands fa-linkedin"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    LinkedIn
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    <a
                      href="https://linkedin.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      linkedin.com/in/example
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              <i className="fa-solid fa-info-circle text-blue-500 mr-2"></i>
              通常我会在24小时内回复消息，紧急情况可以通过电话联系我。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
