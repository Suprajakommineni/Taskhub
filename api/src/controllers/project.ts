import { Request, Response } from "express";
import mongoose from "mongoose";
import Project from "../models/projectmodel";
import Task from "../models/taskmodel";

type AuthenticatedRequest = Request & {
  user?: {
    id?: string;
  };
};

type ProjectMember = {
  username: string;
  avatar: string;
};

const validStatuses = [
  "Pending",
  "Running",
  "Completed",
] as const;

const validPriorities = [
  "Low",
  "Medium",
  "High",
] as const;

type ProjectStatus = (typeof validStatuses)[number];
type ProjectPriority = (typeof validPriorities)[number];

const isProjectStatus = (
  value: unknown
): value is ProjectStatus =>
  typeof value === "string" &&
  validStatuses.includes(value as ProjectStatus);

const isProjectPriority = (
  value: unknown
): value is ProjectPriority =>
  typeof value === "string" &&
  validPriorities.includes(value as ProjectPriority);

const getUserId = (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized",
    });

    return null;
  }

  return userId;
};

const getProjectId = (
  req: AuthenticatedRequest,
  res: Response
) => {
  const parameter = req.params.id;

  const projectId = Array.isArray(parameter)
    ? parameter[0]
    : parameter;

  if (
    !projectId ||
    !mongoose.Types.ObjectId.isValid(projectId)
  ) {
    res.status(400).json({
      message: "Invalid project ID",
    });

    return null;
  }

  return projectId;
};

const getMembers = (
  value: unknown
): ProjectMember[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (member): member is Record<string, unknown> =>
        Boolean(member) &&
        typeof member === "object"
    )
    .map((member) => ({
      username:
        typeof member.username === "string"
          ? member.username.trim()
          : "",
      avatar:
        typeof member.avatar === "string"
          ? member.avatar
          : "",
    }))
    .filter((member) => member.username.length > 0);
};

const validateProjectPayload = (
  body: Record<string, unknown>
) => {
  const name =
    typeof body.name === "string"
      ? body.name.trim()
      : "";

  if (!name) {
    return {
      error: "Project name is required",
    };
  }

  const status: ProjectStatus = isProjectStatus(
    body.status
  )
    ? body.status
    : "Pending";

  const priority: ProjectPriority = isProjectPriority(
    body.priority
  )
    ? body.priority
    : "Medium";

  const dueDate =
    typeof body.dueDate === "string" && body.dueDate
      ? new Date(body.dueDate)
      : null;

  if (!dueDate || Number.isNaN(dueDate.getTime())) {
    return {
      error: "A valid due date is required",
    };
  }

  return {
    data: {
      name,
      status,
      priority,
      dueDate,
      members: getMembers(body.members),
      progress:
        status === "Completed"
          ? 100
          : status === "Running"
            ? 50
            : 0,
    },
  };
};

const sendError = (
  error: unknown,
  res: Response
) => {
  console.error("PROJECT API ERROR:", error);

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Validation failed",
      error: error.message,
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: "Invalid project ID",
    });
  }

  return res.status(500).json({
    message: "Project operation failed",
    error:
      error instanceof Error
        ? error.message
        : "Unexpected error",
  });
};

/* UPLOAD A TEAM MEMBER AVATAR */
export const uploadProjectMemberAvatar = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  const file = (req as AuthenticatedRequest & {
    file?: { path?: string; secure_url?: string };
  }).file;

  const avatar = file?.secure_url ?? file?.path;

  if (!avatar) {
    return res.status(400).json({
      message: "Please choose a valid profile image.",
    });
  }

  return res.status(201).json({ avatar });
};

/* CREATE PROJECT */
export const createProject = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  const payload = validateProjectPayload(req.body);

  if ("error" in payload) {
    return res.status(400).json({
      message: payload.error,
    });
  }

  try {
    const project = await Project.create({
      ...payload.data,
      createdBy: userId,
    });

    return res.status(201).json(project);
  } catch (error) {
    return sendError(error, res);
  }
};

/* GET PROJECTS */
export const getProjects = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  try {
    const projects = await Project.find({
      createdBy: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const result = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({
          project: project._id,
        });

        return {
          ...project,
          tasks: taskCount,
        };
      })
    );

    return res.json(result);
  } catch (error) {
    return sendError(error, res);
  }
};

/* GET PROJECT BY ID */
export const getProjectById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  const projectId = getProjectId(req, res);
  if (!projectId) return;

  try {
    const project = await Project.findOne({
      _id: projectId,
      createdBy: userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.json(project);
  } catch (error) {
    return sendError(error, res);
  }
};

/* UPDATE PROJECT */
export const updateProject = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  const projectId = getProjectId(req, res);
  if (!projectId) return;

  const payload = validateProjectPayload(req.body);

  if ("error" in payload) {
    return res.status(400).json({
      message: payload.error,
    });
  }

  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        createdBy: userId,
      },
      payload.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.json(project);
  } catch (error) {
    return sendError(error, res);
  }
};

/* DELETE PROJECT */
export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  const projectId = getProjectId(req, res);
  if (!projectId) return;

  try {
    const project = await Project.findOneAndDelete({
      _id: projectId,
      createdBy: userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    return sendError(error, res);
  }
};

/* GET ALL PROJECT MEMBERS */
export const getProjectMembers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  try {
    const projects = await Project.find({
      createdBy: userId,
    })
      .select("members")
      .lean();

    const validMembers = projects
      .flatMap((project) => project.members ?? [])
      .filter(
        (member): member is {
          username: string;
          avatar?: string;
        } =>
          typeof member?.username === "string" &&
          member.username.trim().length > 0
      )
      .map((member) => ({
        username: member.username.trim(),
        avatar:
          typeof member.avatar === "string"
            ? member.avatar
            : "",
      }));

    const uniqueMembers = Array.from(
      new Map(
        validMembers.map((member) => [
          member.username.toLowerCase(),
          member,
        ])
      ).values()
    );

    return res.json(uniqueMembers);
  } catch (error) {
    return sendError(error, res);
  }
};
