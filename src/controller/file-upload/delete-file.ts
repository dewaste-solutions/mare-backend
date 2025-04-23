import { Request, Response } from "express";
import { cloudinary } from "../../services/cloudinary.service";

interface DeleteFileRequest extends Request {
    params: {
        0: string; // Wildcard parameter
    };
}

export const deleteFile = async (req: DeleteFileRequest, res: Response): Promise<void> => {
    try {
        const public_id = req.query.public_id as string | undefined;

        if (!public_id) {
            res.status(400).json({
                message: "Public ID is required"
            });
            return;
        }

        // File extensions that should be treated as raw
        const rawExtensions = [".pdf", ".docx"];
        const isRaw = rawExtensions.some(ext => public_id.toLowerCase().endsWith(ext));
        const resourceType = isRaw ? "raw" : "image";

        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: resourceType
        });

        if (result.result === "not found") {
            res.status(404).json({
                message: "File not found"
            });
            return;
        }
        
        res.status(200).json({
            message: "File deleted successfully",
            result
        });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({
            message: "Error deleting file"
        });
    }
};
