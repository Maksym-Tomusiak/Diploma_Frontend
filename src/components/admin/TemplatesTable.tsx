import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Layout,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/Pagination";
import { Template } from "@/types/document";
import { formatDate } from "@/lib/formatters";

interface TemplatesTableProps {
  templates: Template[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  templatesLoading: boolean;
  templatesError: string | null;
  onCreateTemplate: () => void;
  onEditTemplate: (template: Template) => void;
  onDeleteTemplate: (templateId: number) => void;
  onToggleTemplateActive: (templateId: number, isActive: boolean) => void;
}

export function TemplatesTable({
  templates,
  currentPage,
  totalPages,
  onPageChange,
  templatesLoading,
  templatesError,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onToggleTemplateActive,
}: TemplatesTableProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Document Templates
        </h2>
        <Button
          onClick={onCreateTemplate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        {templatesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
          </div>
        ) : templatesError ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-slate-600">{templatesError}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Layout className="h-10 w-10 text-slate-300" />
            <p className="text-slate-600">No templates yet</p>
            <Button
              onClick={onCreateTemplate}
              className="mt-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Template
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b border-slate-200 hover:bg-slate-50">
                <TableHead className="w-[200px] font-semibold text-slate-700">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Description
                </TableHead>
                <TableHead className="w-[150px] font-semibold text-slate-700">
                  Font
                </TableHead>
                <TableHead className="w-[100px] font-semibold text-slate-700">
                  Status
                </TableHead>
                <TableHead className="w-[150px] font-semibold text-slate-700">
                  Created
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow
                  key={template.id}
                  className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                >
                  <TableCell className="font-medium text-slate-900">
                    {template.name}
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm max-w-md truncate">
                    {template.description}
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {template.font_family || (
                      <span className="text-slate-400 italic">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        template.is_active
                          ? "bg-green-100 text-green-700 hover:bg-green-100 border-transparent shadow-none"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-100 border-transparent shadow-none"
                      }
                    >
                      {template.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {formatDate(template.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-[160px] border-slate-200 shadow-md"
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="text-slate-700 focus:bg-slate-50 focus:text-slate-900"
                          onClick={() => onEditTemplate(template)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={
                            template.is_active
                              ? "text-amber-600 focus:bg-amber-50 focus:text-amber-700"
                              : "text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700"
                          }
                          onClick={() =>
                            onToggleTemplateActive(
                              template.id,
                              template.is_active
                            )
                          }
                        >
                          {template.is_active ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:bg-red-50 focus:text-red-700"
                          onClick={() => onDeleteTemplate(template.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-4"
      />
    </>
  );
}
