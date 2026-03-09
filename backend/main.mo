import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type Price = Nat64; // Cents to avoid floating-point errors

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Price;
    image : Storage.ExternalBlob;
    createdAt : Int;
    updatedAt : Int;
  };

  public type ProductInput = {
    name : Text;
    description : Text;
    price : Price;
  };

  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<Text, Product>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management Functions (Admin-only for write operations)
  public shared ({ caller }) func addProduct(input : ProductInput, image : Storage.ExternalBlob) : async Product {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let now = Time.now();
    let product : Product = {
      id = input.name;
      name = input.name;
      description = input.description;
      price = input.price;
      image;
      createdAt = now;
      updatedAt = now;
    };

    products.add(product.id, product);
    product;
  };

  public shared ({ caller }) func updateProduct(
    id : Text,
    input : ProductInput,
    image : Storage.ExternalBlob,
  ) : async Product {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    let existing = switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist: " # id) };
      case (?p) { p };
    };

    let updated : Product = {
      id = existing.id;
      name = input.name;
      description = input.description;
      price = input.price;
      image;
      createdAt = existing.createdAt;
      updatedAt = Time.now();
    };

    products.add(id, updated);
    updated;
  };

  public shared ({ caller }) func removeProduct(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product does not exist");
    };

    products.remove(id);
  };

  // Public read operations (no authentication required - this is a public storefront)
  public query func getProduct(productId : Text) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist: " # productId) };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };
};
