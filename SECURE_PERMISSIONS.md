# Secure Permissions Matrix (with Department-Level Restrictions)

This table proposes a more secure, fine-grained permissions model for your application, now including department-level restrictions. Please review and confirm before implementation.

| Endpoint/Action                        | ADMIN | CHEFOP (Own Dept) | CHEFTECH (Own Dept) | TECHNICIEN (Own Dept) |
|----------------------------------------|:-----:|:-----------------:|:-------------------:|:---------------------:|
| **User Management**                    |       |                   |                     |                       |
| View all users                         |  ✅   |        ✅         |         ✅          |          ❌           |
| View single user                       |  ✅   |        ✅         |         ✅          |        (self)         |
| Add user                               |  ✅   |        ✅         |         ❌          |          ❌           |
| Update user                            |  ✅   |        ✅         |         ❌          |          ❌           |
| Delete user                            |  ✅   |        ❌         |         ❌          |          ❌           |
| Update own profile                     |  ✅   |        ✅         |         ✅          |          ✅           |
|
| **Planning Management**                |       |                   |                     |                       |
| View all plannings                     |  ✅   |        ✅         |         ✅          |          ✅           |
| View single planning                   |  ✅   |        ✅         |         ✅          |          ✅           |
| Add planning                           |  ✅   |        ✅         |         ✅          |          ❌           |
| Update planning                        |  ✅   |        ✅         |         ✅          |          ❌           |
| Delete planning                        |  ✅   |        ❌         |         ❌          |          ❌           |
|
| **Work Order Management**              |       |                   |                     |                       |
| View all work orders                   |  ✅   |        ✅         |         ✅          |          ✅           |
| View single work order                 |  ✅   |        ✅         |         ✅          |          ✅           |
| Add work order                         |  ✅   |        ✅         |         ✅          |          ❌           |
| Update work order                      |  ✅   |        ✅         |         ✅          |   (assigned only)     |
| Delete work order                      |  ✅   |        ❌         |         ❌          |          ❌           |
| Assign work order to technicien        |  ✅   |        ✅         |         ✅          |          ❌           |
| Update status of assigned work order   |  ✅   |        ✅         |         ✅          |   (assigned only)     |

**Legend:**
- ✅ = Allowed (all departments for ADMIN, own department for others)
- ❌ = Not allowed
- (self) = Only their own user profile
- (assigned only) = Only work orders assigned to them

**Notes:**
- "Own Dept" means the user can only access/manage resources within their department.
- "Update own profile" means a user can update their own information, but not others'.
- "Assign work order to technicien" means only those roles can assign, not the technicien themselves.
- This matrix assumes all roles are authenticated.

---

**Please review and confirm or suggest changes.**