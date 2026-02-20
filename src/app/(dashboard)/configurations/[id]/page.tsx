"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { configurationsApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EditConfigurationSkeleton } from "@/components/skeletons/EditConfigurationsSkeleton";
import {
  ArrowLeft,
  Globe,
  Star,
  Users,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditConfigurationPage() {
  const router = useRouter();
  const params = useParams();
  const configId = parseInt(params.id as string);
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    description: "",
    criteria_prompt: "",
    check_website: true,
    check_google_reviews: false,
    check_social_media: false,
    check_jobs_page: false,
  });

  const { data: config, isLoading } = useQuery({
    queryKey: ["configuration", configId],
    queryFn: () => configurationsApi.getById(configId),
  });

  // Populate form when config loads
  useEffect(() => {
    if (config) {
      setForm({
        name: config.name,
        description: config.description || "",
        criteria_prompt: config.criteria_prompt,
        check_website: config.check_website,
        check_google_reviews: config.check_google_reviews,
        check_social_media: config.check_social_media,
        check_jobs_page: config.check_jobs_page,
      });
    }
  }, [config]);

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof configurationsApi.update>[1]) =>
      configurationsApi.update(configId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
      queryClient.invalidateQueries({ queryKey: ["configuration", configId] });
      toast.success(`Search "${form.name}" updated`);
      router.push("/configurations");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update configuration");
    },
  });

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    if (!form.criteria_prompt.trim()) {
      toast.error("Please enter search criteria");
      return;
    }

    updateMutation.mutate({
      name: form.name,
      description: form.description.trim() || undefined,
      criteria_prompt: form.criteria_prompt,
      check_website: form.check_website,
      check_google_reviews: form.check_google_reviews,
      check_social_media: form.check_social_media,
      check_jobs_page: form.check_jobs_page,
    });
  };

  const examplePrompts = [
    {
      label: "No website but has reviews",
      prompt:
        "Find businesses that have 10+ Google reviews but either no website, a broken website, or an extremely outdated website (pre-2020).",
    },
    {
      label: "Hiring but not on LinkedIn",
      prompt:
        "Find companies that are actively hiring (have job postings) but are not posting their jobs on LinkedIn.",
    },
    {
      label: "E-commerce not using Shopify",
      prompt:
        "Find e-commerce businesses that are not using Shopify as their platform (look for alternative platforms like WooCommerce, Magento, custom builds).",
    },
  ];

  if (isLoading) {
    return (
      <EditConfigurationSkeleton />
    );
  }

  if (!config) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-400">Configuration not found</p>
          <Link href="/configurations" className="mt-4 inline-block">
            <Button variant="secondary" size="sm">
              Back to searches
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/configurations">
        <button className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 mb-6 transition-colors">
          <ArrowLeft size={14} />
          Back to searches
        </button>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Edit Search</h1>
        <p className="text-sm text-gray-400">
          Update your search criteria and data sources
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        {/* Name */}
        <Input
          label="Search Name"
          placeholder="e.g. Businesses with reviews but no website"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1.5">
            Description
            <span className="text-gray-500 font-normal ml-1">(optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Brief explanation of what this search is for"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Criteria Prompt */}
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1.5">
            Search Criteria
            <span className="text-red-400 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Describe what you're looking for in plain English. Be specific about
            what makes a company a match.
          </p>
          <textarea
            rows={5}
            placeholder="Example: Find businesses that have 10+ Google reviews but no functional website..."
            value={form.criteria_prompt}
            onChange={(e) =>
              setForm((f) => ({ ...f, criteria_prompt: e.target.value }))
            }
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Example Prompts */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-yellow-400" />
            <p className="text-xs font-medium text-gray-300">
              Example Searches
            </p>
          </div>
          <div className="space-y-2">
            {examplePrompts.map((example, i) => (
              <button
                key={i}
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    criteria_prompt: example.prompt,
                  }))
                }
                className="w-full text-left px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
              >
                <p className="text-xs font-medium text-gray-200 mb-1">
                  {example.label}
                </p>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {example.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-3">
            Data Sources to Check
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-start gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
              <input
                type="checkbox"
                checked={form.check_website}
                onChange={(e) =>
                  setForm((f) => ({ ...f, check_website: e.target.checked }))
                }
                className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={14} className="text-blue-400" />
                  <span className="text-sm font-medium text-gray-200">
                    Website
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Check homepage, about, contact pages
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
              <input
                type="checkbox"
                checked={form.check_google_reviews}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    check_google_reviews: e.target.checked,
                  }))
                }
                className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={14} className="text-yellow-400" />
                  <span className="text-sm font-medium text-gray-200">
                    Google Reviews
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Review count, ratings, business info
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
              <input
                type="checkbox"
                checked={form.check_social_media}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    check_social_media: e.target.checked,
                  }))
                }
                className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={14} className="text-purple-400" />
                  <span className="text-sm font-medium text-gray-200">
                    Social Media
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Facebook, Instagram, LinkedIn presence
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
              <input
                type="checkbox"
                checked={form.check_jobs_page}
                onChange={(e) =>
                  setForm((f) => ({ ...f, check_jobs_page: e.target.checked }))
                }
                className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase size={14} className="text-green-400" />
                  <span className="text-sm font-medium text-gray-200">
                    Jobs/Careers Page
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Job postings and hiring signals
                </p>
              </div>
            </label>
          </div>
        </div>

        {updateMutation.error && (
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
            {(updateMutation.error as Error).message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <Link href="/configurations">
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
        </Link>
        <Button
          variant="primary"
          size="sm"
          loading={updateMutation.isPending}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
