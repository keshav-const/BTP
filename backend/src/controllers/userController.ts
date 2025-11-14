import mongoose from 'mongoose';
import { Response } from 'express';
import { User } from '@/models';
import { ApiResponse, IAuthRequest } from '@/types';

const parseBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null) return undefined;

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }

  return undefined;
};

const formatAddresses = (addresses: any[]) => {
  return addresses
    .slice()
    .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
    .map((address) => ({
      id: address._id,
      label: address.label || null,
      fullName: address.fullName,
      phone: address.phone || null,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    }));
};

const canManageUser = (requester: any, userId: string) => {
  if (!requester) return false;
  if (requester.role === 'admin') return true;
  return requester._id.toString() === userId;
};

export const userController = {
  async getAddresses(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { userId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user id',
        });
        return;
      }

      const requester = req.user!;
      if (!canManageUser(requester, userId)) {
        res.status(403).json({
          success: false,
          message: 'You are not allowed to access these addresses',
        });
        return;
      }

      const user = await User.findById(userId).select('addresses');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Addresses retrieved successfully',
        data: formatAddresses(user.addresses || []),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve addresses',
        error: (error as Error).message,
      });
    }
  },

  async createAddress(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { userId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user id',
        });
        return;
      }

      const requester = req.user!;
      if (!canManageUser(requester, userId)) {
        res.status(403).json({
          success: false,
          message: 'You are not allowed to add addresses for this user',
        });
        return;
      }

      const user = await User.findById(userId).select('addresses');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      const isDefault = parseBoolean(req.body.isDefault) ?? false;

      if (isDefault) {
        user.addresses.forEach((address) => {
          address.isDefault = false;
        });
      }

      user.addresses.push({
        label: req.body.label,
        fullName: req.body.fullName,
        phone: req.body.phone,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        country: req.body.country,
        isDefault,
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: 'Address created successfully',
        data: formatAddresses(user.addresses),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create address',
        error: (error as Error).message,
      });
    }
  },

  async updateAddress(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { userId, addressId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(addressId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user or address id',
        });
        return;
      }

      const requester = req.user!;
      if (!canManageUser(requester, userId)) {
        res.status(403).json({
          success: false,
          message: 'You are not allowed to update addresses for this user',
        });
        return;
      }

      const user = await User.findById(userId).select('addresses');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      const address = user.addresses.id(addressId);
      if (!address) {
        res.status(404).json({
          success: false,
          message: 'Address not found',
        });
        return;
      }

      const isDefault = parseBoolean(req.body.isDefault);

      const updatableFields: Array<keyof typeof address> = [
        'label',
        'fullName',
        'phone',
        'street',
        'city',
        'state',
        'zipCode',
        'country',
      ];

      updatableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          // @ts-expect-error dynamic assignment
          address[field] = req.body[field];
        }
      });

      if (isDefault !== undefined) {
        if (isDefault) {
          user.addresses.forEach((addr) => {
            addr.isDefault = addr._id.toString() === addressId;
          });
        } else {
          address.isDefault = false;
        }
      }

      await user.save();

      res.json({
        success: true,
        message: 'Address updated successfully',
        data: formatAddresses(user.addresses),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update address',
        error: (error as Error).message,
      });
    }
  },

  async deleteAddress(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { userId, addressId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(addressId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user or address id',
        });
        return;
      }

      const requester = req.user!;
      if (!canManageUser(requester, userId)) {
        res.status(403).json({
          success: false,
          message: 'You are not allowed to delete addresses for this user',
        });
        return;
      }

      const user = await User.findById(userId).select('addresses');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      const address = user.addresses.id(addressId);
      if (!address) {
        res.status(404).json({
          success: false,
          message: 'Address not found',
        });
        return;
      }

      const wasDefault = address.isDefault;
      address.deleteOne();

      if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
      }

      await user.save();

      res.json({
        success: true,
        message: 'Address deleted successfully',
        data: formatAddresses(user.addresses),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete address',
        error: (error as Error).message,
      });
    }
  },

  async updateProfile(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { userId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user id',
        });
        return;
      }

      const requester = req.user!;
      if (!canManageUser(requester, userId)) {
        res.status(403).json({
          success: false,
          message: 'You are not allowed to update this profile',
        });
        return;
      }

      const updates: Record<string, unknown> = {};
      if (req.body.firstName !== undefined) updates.firstName = req.body.firstName;
      if (req.body.lastName !== undefined) updates.lastName = req.body.lastName;
      if (req.body.phoneNumber !== undefined) updates.phoneNumber = req.body.phoneNumber;

      const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
      }).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber ?? null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: (error as Error).message,
      });
    }
  },
};
